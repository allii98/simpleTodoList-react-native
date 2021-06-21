import React, { Component } from 'react';
import { View, Text, StatusBar, TextInput, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: '',
      todoData : [],
      editMode : false,
      index: -1
    };
  }

  componentDidMount() {
    this.getdata();
  }

  // fungsi check
  check = (item, index) => {
    let allData = this.state.todoData;
    let editItem = item;
    if (editItem.status == 'selesai') {
      editItem.status = 'belum selesai';
    } else {
      
      editItem.status = 'selesai';
    }

    allData[index].status = editItem.status;
    this.setState({
      todoData: allData
    }, () => this.saveData())
  }

  //fungsi delete
  deleteItem = (index) => {
    let allData = this.state.todoData;
    allData.splice(index,1);
    this.setState({todoData: allData}, () => this.saveData());
  }

  // fungsi add data
  addData = () => {
    let allData = this.state.todoData;
    if (this.state.editMode) {
      allData[this.state.index].name= this.state.todo;
      this.setState({editMode: false})
    } else {
      
      allData.push({
         name: this.state.todo,
         status: 'belum selesai'
      });
    }
    this.setState({todoData: allData, todo: ''}, () => this.saveData());
  }

  // untuk menyimpan di storage
  saveData = async () => {
    try {
      await AsyncStorage.setItem('@data', JSON.stringify(this.state.todoData));
      console.log('berhasil disimpan');
    } catch (e) {
      console.log(e);
      
    }
  }
  
  // fungsi untuk membaca data
  getdata = async () => {
    try {
      let value = await AsyncStorage.getItem('@data');
      value = JSON.parse(value);
      if (value !== null) {
        
        this.setState({todoData: value})
      }
      console.log('data berhasil di get', value)
    } catch (e) {
      console.log(e);
    }
  }


  render() {
    return (
      <View style={{
        flex: 1,
        backgroundColor:'#212121'
      }}>
        <StatusBar barStyle="light-content" backgroundColor="#272727"/>
        {/* Header */}
        <View style={{
          justifyContent:'center', 
          alignItems:'center',
          borderColor:'#303030',
          paddingVertical: 20,
          elevation: 3,
          marginBottom: 8
          }}>
          <Text style={{color:'#ffffff'}}>TodoList</Text>
        </View>
        {/* end header */}

        <FlatList 
        data={this.state.todoData}
        keyExtractor={(item) => item.name}
        renderItem={({item, index}) => 
         <View style={{
          backgroundColor:'#303030',
          marginHorizontal: 20,
          paddingVertical: 10,
          paddingHorizontal: 10,
          marginTop: 10,
          borderRadius: 3,
          flexDirection:'row'
        }}>
          <TouchableOpacity
          onPress={() => this.setState({todo: item.name, index, editMode: true})}
           style={{flex:1, justifyContent:'center', }}>

              <Text style={{color:'#ffffff'}}>{item.name}</Text>
              <Text style={{color:'#ffffff'}}>{item.status}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.deleteItem(index)} style={{justifyContent:'center'}}>
          <Icon name={'trash-alt'} size={30} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.check(item, index)} style={{justifyContent:'center', marginLeft: 40}}>
          <Icon name={item.status == 'selesai' ? 'check-square' : 'square'} size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
        }
        />

       
        {/* form input */}
        <TextInput 
          value={this.state.todo}
          onChangeText={(text) => this.setState({todo: text})}
          style={{
            backgroundColor:'#303030',
             paddingHorizontal:10,
              marginHorizontal:20, 
              color:'#ffffff',
              marginBottom: 25,
              borderRadius: 5,
          }}
          placeholder="Masukkan kata disini...."
          placeholderTextColor='#ffffff'
        />
        <TouchableOpacity
        onPress={() => this.addData()}
         style={{
          backgroundColor: '#303030',
          marginHorizontal:20,
          marginBottom:25,
          justifyContent:'center',
          alignItems:'center',
          paddingVertical:10,
          borderRadius:3
        }}>
          <Text style={{color:'#ffffff'}}>New Todo</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
