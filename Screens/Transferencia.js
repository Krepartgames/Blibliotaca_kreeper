import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { doc, getDoc, collection, query, where, getDocs, limit, orderBy, addDoc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import {db} from "../config";
import { async } from '@firebase/util';

const fundoImg = require("../assets/background2.png")
const icone = require("../assets/appIcon.png")
const name = require("../assets/appName.png")

export default class Transferencia extends Component {
  constructor() {
    super()
    this.state = {
      modo: 'normal',
      permisao: null,
      scaneado: false,
      dados: "",
      idLivro: "",
      idAluno: "",
      nomeLivro:"",
      nomeAluno:"",
    }
  }
  pegarPermisao = async (modo) => {
    const { status } = await BarCodeScanner.requestPermissionsAsync()
    this.setState({
      modo: modo,
      permisao: status === "granted",
      scaneado: false,
      dados: "",
    })
  }
  pegarDadosScaner = async ({ type, data }) => {
    const {modo} = this.state
    if (modo === "idLivro"){
      this.setState({
      modo: 'normal',
      scaneado: true,
      idLivro: data,
    })
    
    console.log(this.state.idLivro)
    }
    if (modo === "idAluno"){
      this.setState({
      modo: 'normal',
      scaneado: true,
      idAluno: data,
    })
    }
  }
  fazerTrans = async() =>{
    const {idLivro} = this.state
    const {idAluno}= this.state
    await this.pegarInfoLivro(idLivro)
    await this.pegarInfoAluno(idAluno)
    const {nomeLivro, nomeAluno} = this.state
    const disponibilidade = await this.checarDisponibilidadeLivro(idLivro)

    if (disponibilidade){
      if(disponibilidade === "issue"){
        var elegivel = this.checarAlunoParaRetirada(idAluno)
        
        elegivel? this.iniciarRetirada(idLivro, idAluno, nomeLivro, nomeAluno): null

      } else {
        var elegivel = this.checarAlunoParaDevolucao(idAluno,idLivro)

        elegivel? this.iniciarDevolucao(idLivro, idAluno, nomeLivro, nomeAluno): null

      }
    }else{
      ToastAndroid.show("Documento não localizado, tente novamente", ToastAndroid.LONG)
    }

    const doclivro = doc(db,"livros",idLivro)
    getDoc(doclivro)
    .then(doc => console.log(doc.data()))
    .catch(error => alert(error.message))
    
  }
  pegarInfoLivro = async(idLivro) =>{
    idLivro = idLivro.trim()
    const refLivro = doc(db,"livros",idLivro)
    try {
      const doclivro = await getDoc(refLivro)
      this.setState({
        nomeLivro: doclivro.data().livro_nome
      })
    } catch (error) {
      console.error(error.message)
      alert(error.message)
    }
  }

  pegarInfoAluno = async(idAluno) =>{
    idAluno = idAluno.trim()
    const refAluno = doc(db,"alunos",idAluno)
    const docAluno = await getDoc(refAluno)
    try {
      this.setState({
        nomeAluno: docAluno.data().aluno_nome
      })
    } catch (error) {
      console.error(error.message)
      alert(error.message)
    }
  }

  checarDisponibilidadeLivro = async(idLivro) => {
    const doclivro = doc(db,"livros",idLivro)
    const documento = await getDoc(doclivro)

      try {
        var livro = documento.data()
      if (documento.exists()) {
        if (livro.esta_disponivel){
          return "issue"
        }else {
          return "return"
        }
      } else {
        return false
      }
      } catch (error) {
        console.error(error.message)
      }
  }
  iniciarRetirada = (idLivro,idAluno,nomeLivro,nomeAluno) =>{
    //ToastAndroid.show("livro Retirado", ToastAndroid.LONG)
    var refTransferencias = collection(db, "transferencias")
    var livroRef = doc(db, "livros", idLivro)
    var alunoRef = doc(db, "alunos", idAluno)
    addDoc(refTransferencias, {
      aluno_id: idAluno,
      aluno_nome: nomeAluno,
      livro_id: idLivro,
      livro_nome: nomeLivro,
      data: serverTimestamp(),
      tipo_transferencia: "issue"
    })
    updateDoc(livroRef,{
        esta_disponivel: false
      })
    updateDoc(alunoRef, {
      num_livros_retirados: increment(1)
    })

    alert("livro Retirado")
  }
  iniciarDevolucao = (idLivro,idAluno,nomeAluno,nomeLivro) =>{
    //ToastAndroid.show("livro Devolvido", ToastAndroid.LONG)
    var refTransferencias = collection(db, "transferencias")
    var livroRef = doc(db, "livros", idLivro)
    var alunoRef = doc(db, "alunos", idAluno)
    addDoc(refTransferencias, {
      aluno_id: idAluno,
      aluno_nome: nomeAluno,
      livro_id: idLivro,
      livro_nome: nomeLivro,
      data: serverTimestamp(),
      tipo_transferencia: "return"
    })
    updateDoc(livroRef,{
        esta_disponivel: true
      })
    updateDoc(alunoRef, {
      num_livros_retirados: increment(-1)
    })
    alert("livro devovido")
  }

  checarAlunoParaRetirada = async(idAluno)=>{
    const refAluno = doc(db,"alunos",idAluno)
    const docAluno = await getDoc(refAluno)

    var elegivel

    if (docAluno.exists()){
      if (docAluno.data().num_livros_retirados < 2) {
        elegivel = true
      } else {
        elegivel = false
        alert("Limite maximo de livros atingido")
      }
    }else{
      elegivel = false
      alert("id de aluno não identificado")
    }

    return elegivel
  }

  checarAlunoParaDevolucao = async(idAluno, idLivro)=>{
    const refTransferencia = query(
      collection(db, "transferencias"),
      where("livro_id", "==", idAluno),
      orderBy("data", "desc"),
      limit(1)
      )
      
      const docTransferencia = await getDocs(refTransferencia)

      var elegivel
      docTransferencia.forEach((doc)=>{
        var ultimaTransferencia = doc.data()

      if (ultimaTransferencia.aluno_id === idAluno){
        elegivel = true
      }else{
        elegivel = false
        alert(" Este livro não foi pego por este aluno")
      }
      })

      return elegivel
  }

  render() {
    const { modo, permisao, scaneado, dados, idAluno, idLivro } = this.state
    if (modo !== "normal") {
      return (
        <BarCodeScanner onBarCodeScanned={scaneado ? undefined : this.pegarDadosScaner} style={StyleSheet.absoluteFillObject} />
      )
    }
    return (
      <KeyboardAvoidingView style={styles.container} behavior = "height">
        <ImageBackground source={fundoImg} style = {styles.bgImage}>
          <View style = { styles.upperContainer}>
            <Image source={icone} style = {styles.appIcon} />
            <Image source={name} style = {styles.appName} />
          </View>
          <View style={styles.lowerContainer}>
            <View style={styles.textInputContainer}>
              <TextInput placeholder={"id do livro"} placeholderTextcolor={"white"} style={styles.textInput}  value = {idLivro} 
              onChangeText = {(text) =>{
                this.setState({
                  idLivro: text
                })
              }}/>
              <TouchableOpacity style={styles.scanbutton} onPress={() => {
                this.pegarPermisao("idLivro")
              }}>
                <Text style={styles.scanbuttonText}> digitalizar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textInputContainer}>
              <TextInput placeholder={"id do aluno"} placeholderTextcolor={"white"} style={styles.textInput} value = {idAluno} 
              onChangeText = {(text) =>{
                this.setState({
                  idAluno: text
                })
              }}/>
              <TouchableOpacity style={styles.scanbutton} onPress={() => {
                this.pegarPermisao("idAluno")
              }}>
                <Text style={styles.scanbuttonText}> digitalizar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={this.fazerTrans}>
              <Text style={styles.buttonText}> Enviar </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnText: {
    color: 'white',
    fontSize: 24,
    alignSelf: 'center',
    fontFamily: 'fonte'
  },
  btn: {
    width: '70%',
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center'
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  upperContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  appIcon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginTop: 80,
  },
  appName: {
    width: 200,
    resizeMode: "contain",
  },
  buttonText: {
    color: "#ffff",
    fontSize: 20,
    textAlign: "center",
    fontFamily: "fonte",
  },
  button: {
    width: "43%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F48D20",
    borderRadius: 15,
    marginTop: 25,
    height: 55,
  },
  lowerContainer: {
    flex: 0.5,
    alignItems: "center",
  },
  textInputContainer: {
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: "row",
    borderColor: "#FFFFFF",
    marginTop: 10,
    justifyContent: "space-between"
  },
  textInput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "fonte",
    color: "#FFFFFF"
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#F48D20",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    justifyContent: "center",
    alignItems: "center"
  },
  scanbuttonText: {
    fontSize: 17,
    color: "#fff",
    fontFamily: "fonte"
  },
});
