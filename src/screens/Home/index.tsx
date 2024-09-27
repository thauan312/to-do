import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskItem from '../../components/Task';
import { Ionicons } from '@expo/vector-icons';
import AddTaskModal from '../../components/CreateTask';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../types'; 

interface Task {
  id: string;
  title: string;
  description: string; 
  priority: string;
  completed: boolean;
  dueDate: Date | null; 
}

export default function TaskScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFilteredTasks = () => {
    return tasks.filter(task =>
      (showCompleted ? task.completed : !task.completed) &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  

  const saveTask = async (title: string, description: string, priority: string, dueDate: Date | null) => {
    const newTask: Task = {
      title,
      description,
      id: Date.now().toString(),
      priority,
      completed: false,
      dueDate,
    };
  
    const newTasks = [...tasks, newTask];
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
      setTasks(newTasks);
      Alert.alert("Sucesso", "Tarefa adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar tarefa", error);
    }
  };

  const confirmDelete = (id: string) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza que deseja excluir esta tarefa?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          onPress: () => deleteTask(id),
          style: "destructive"
        }
      ]
    );
  };

  const deleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      Alert.alert("Sucesso", "Tarefa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir tarefa", error);
    }
  };
  
  const onToggleComplete = async (updatedTask: Task) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === updatedTask.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
  
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      Alert.alert("Sucesso", "Tarefa atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar tarefa", error);
    }
  };

  const filteredTasks = tasks.filter(task =>
    (showCompleted ? task.completed : !task.completed) &&
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}/>
      <View style={styles.searchContainer} >
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          placeholderTextColor="#2D6C4A"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color="#2D6C4A" style={styles.searchIcon} />
      </View>

      <View style={styles.buttonContainer}>
        {['Pendentes', 'Concluídas'].map((status, index) => {
          const isCompleted = status === 'Concluídas';
          const circleStyle = isCompleted ? styles.completedCircle : styles.pendingCircle;
          const textStyle = isCompleted ? styles.completedText : styles.pendingText;
    
          return (
            <TouchableOpacity
              key={index}
              style={[
              styles.button,
                (showCompleted ? status === 'Concluídas' : status === 'Pendentes') && styles.activeButton,
              ]}
              onPress={() => setShowCompleted(isCompleted)}
            >
              <Text style={styles.buttonText}>Tarefas {status}</Text>
              <View style={circleStyle}>
                <Text style={textStyle}>
                  {tasks.filter((task) => task.completed === isCompleted).length}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>



      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard" size={40} color="#E0DCE4" />
          <Text style={styles.emptyTextBold}>Você ainda não tem tarefas cadastradas</Text>
          <Text style={styles.emptyText}>Crie tarefas e organize seus itens a fazer</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredTasks()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Detalhes', { 
                task: item, 
                onDelete: confirmDelete, 
                onUpdate: onToggleComplete 
              })}>
              <TaskItem 
                task={item} 
                onDelete={confirmDelete} 
                onToggleComplete={() => onToggleComplete(item)} 
              />
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.floatingButton} onPress={() => setIsModalVisible(true)}>
        <Ionicons name="add" size={32} color="#2D6C4A" />
      </TouchableOpacity>

      <AddTaskModal 
        isVisible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onAddTask={saveTask} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#E0DCE4', 
    height: 25, 
    position: 'absolute',
    top: 0,
    left: 0,
    right:0, 
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 5,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#A8CDF9',
  },
  buttonText: {
    fontSize: 14,
    color: '#6B6572',
  },
  pendingCircle: {
    width: 24,
    height: 24,
    borderRadius: 12, 
    backgroundColor: '#A8CDF9', 
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8, 
  },
  completedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12, 
    backgroundColor: '#BFE3D0', 
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8, 
  },
  pendingText: {
    color: '#005CC9', 
    fontWeight: 'bold',
  },
  completedText: {
    color: '#2D6C4A', 
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#BFE3D0',
    borderRadius: 50,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DADADA',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 20,
    height: 49,
    marginTop: -20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 24,
    fontSize: 16,
    color: '#2D6C4A',
  },
  searchIcon: {
    marginRight: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  emptyTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 5,
    color: '#6B6572',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B6572',
  },
});
