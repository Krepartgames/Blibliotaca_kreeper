import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ImageBackground, Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { doc, getDoc } from "firebase/firestore";
import {db} from "../config";
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
  fazerTrans = () =>{
    const {idLivro} = this.state
    const {idAluno}= this.state
    this.pegarInfoLivro(idLivro)
    //this.pegarInfoAluno(idAluno)
    const disponibilidade = this.checarDisponibilidadeLivro(idLivro)

    if (disponibilidade){
      if(disponibilidade === "issue"){
        this.iniciarRetirada()
      } else {
        this.iniciarDevolucao()
      }
    }else{
      ToastAndroid.show("Documento não localizado, tente novamente", ToastAndroid.LONG)
    }

    const doclivro = doc(db,"livros",idLivro)
    getDoc(doclivro)
    .then(doc => console.log(doc.data()))
    .catch(error => alert(error.message))
    
  }
  pegarInfoLivro =(idLivro) =>{
    idLivro = idLivro.trim()
    const doclivro = doc(db,"livros",idLivro)
    getDoc(doclivro)
    .then((doc) => {
      this.setState({
        nomeLivro: doc.data().livro_nome
      })
    }).catch(error => alert(error.message))
  }

  pegarInfoAluno =(idAluno) =>{
    idAluno = idAluno.trim()
    const docAluno = doc(db,"alunos",idAluno)
    getDoc(docAluno)
    .then((doc) => {
      this.setState({
        nomeAluno: doc.data().aluno_nome
      })
    }).catch(error => alert(error.message))
  }

  checarDisponibilidadeLivro = async(idLivro) => {
    const doclivro = doc(db,"livros",idLivro)
    getDoc(doclivro)
    .then((doc) => {
      var livro = doc.data()
      if (livro) {
        if (livro.esta_disponivel){
          return "issue"
        }else {
          return "return"
        }
      } else {
        return false
      }
    }).catch(error => alert(error.message))
  }
  iniciarRetirada = () =>{
    ToastAndroid.show("livro Retirado", ToastAndroid.LONG)
  }
  iniciarDevolucao = () =>{
    ToastAndroid.show("livro Devolvido", ToastAndroid.LONG)
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
