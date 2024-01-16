import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [task, setTask] = useState('');
  const [taskItems, setTaskItems] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) setTaskItems(JSON.parse(savedTasks));
    } catch (e) {
      Alert.alert('Error', 'Failed to load tasks');
    }
  };

  const handleAddTask = async () => {
    if (task.trim().length === 0) {
      Alert.alert('Error', 'Task cannot be empty');
      return;
    }
    const newTasks = [...taskItems, task];
    setTaskItems(newTasks);
    setTask('');
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const handleDeleteTask = async (index) => {
    let newTasks = [...taskItems];
    newTasks.splice(index, 1);
    setTaskItems(newTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const renderTaskItem = ({ item, index }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskText}>{item}</Text>
      <TouchableOpacity onPress={() => handleDeleteTask(index)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.taskInput}
        placeholder="Write a task..."
        value={task}
        onChangeText={text => setTask(text)}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={taskItems}
        renderItem={renderTaskItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  taskInput: {
    padding: 15,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 5,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  taskText: {
    fontSize: 18,
  },
  deleteText: {
    color: 'red',
  },
});
