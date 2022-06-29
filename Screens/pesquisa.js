import React, { Component } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { db } from '../config';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import {ListItem, Icon} from "react-native-elements"

export default class Pesquisa extends Component {
  constructor(props){
    super(props)
    this.state = {
      transferencias: [],
      ultimaTrans: "",
      text: "",
    }
  }

  pegarTransferencias = async()=>{
    var ref = query(
      collection(db, "transferencias"),
      orderBy("data","desc"),
      limit(10)
    )
    var trans = await getDocs(ref)

    trans.forEach((doc)=>{
      this.setState({
        transferencias: [...this.state.transferencias, doc.data()],
        ultimaTrans: doc,
      })
    })
  }

  componentDidMount(){
    this.pegarTransferencias()
  }

  pegarMaisTrans = async(text)=>{
    const {transferencias, ultimaTrans} = this.state
    var ref = query(
      collection(db, "transferencias"),
      orderBy("data","desc"),
      limit(10),
      startAfter(ultimaTrans),
    )
    var docs = await getDocs(ref)
    docs.forEach((doc)=>{
      this.setState({
        transferencias: [...this.state.transferencias, doc.data()],
        ultimaTrans: doc,
      })
    })
  }

  renderItem = ({ item, i }) => {
    var date = item.data.toDate().toString().split(" ").splice(0, 4).join(" ");

    var transactionType =
      item.tipo_transferencia === "issue" ? "retirado" : "devolvido";
    return (
      <View style={{ borderWidth: 1 }}>
        <ListItem key={i} bottomDivider>
          <Icon type={"antdesign"} name={"book"} size={40} />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              {`${item.livro_nome} ( ${item.livro_id} )`}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {`Este livro foi ${transactionType} por ${item.aluno_nome}`}
            </ListItem.Subtitle>
            <View style={styles.lowerLeftContainer}>
              <View style={styles.transactionContainer}>
                <Text
                  style={[
                    styles.transactionText,
                    {
                      color:
                        item.tipo_transferencia === "issue"
                          ? "#78D304"
                          : "#0364F4",
                    },
                  ]}
                >
                  <Icon
                    type={"ionicon"}
                    name={
                      item.tipo_transferencia === "issue"
                        ? "checkmark-circle-outline"
                        : "arrow-redo-circle-outline"
                    }
                    color={
                      item.tipo_transferencia === "issue" ? "#78D304" : "#0364F4"
                    }
                  />
                  {item.tipo_transferencia.charAt(0).toUpperCase() +
                    item.tipo_transferencia.slice(1)}
                </Text>
              </View>
              <Text style={styles.date}>{date}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };
  render(){
    return (
      <View style={styles.container}>
        <View style={styles.lowerContainer}>
          <FlatList
          data = {this.state.transferencias}
          renderItem = {this.renderItem}
          keyExtractor = {(item,index)=>{ index.toString() }}
          onEndReached = {()=>{
            this.pegarMaisTrans("")
          }}
          onEndReachedThreshold = {0.7}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#5653d4",
  },
  upperContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 70,
  },
  textinputContainer: {
    borderRadius: 10,
    borderWidth: 3,
    flexDirection: "row",
    borderColor: "#FFFFFF",
    marginTop: 10,
    justifyContent: "space-between",
  },
  textinput: {
    minWidth: "57%",
    height: 50,
    padding: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "fonte",
    color: "#FFFFFF",
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#F48D20",
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "fonte",
    color: "#ffffff",
  },
  lowerContainer: {
    flex: 0.8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontFamily: "fonte",
    width: "75%",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "fonte",
    width: "75%",
  },
  lowerLeftContainer: {
    alignSelf: "flex-end",
    marginTop: -40,
  },
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 20,

    fontFamily: "fonte",
  },
  date: {
    fontSize: 12,
    fontFamily: "fonte",
    paddingTop: 5,
  },
});