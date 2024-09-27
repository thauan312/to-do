import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList, Task } from '../../../types';
import { Ionicons } from '@expo/vector-icons';

interface TaskDetailProps {
  route: RouteProp<RootStackParamList, 'Detalhes'>;
}

const TaskDetailScreen: React.FC<TaskDetailProps> = ({ route }) => {
  const navigation = useNavigation();
  const { task, onDelete, onUpdate } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [completed, setCompleted] = useState(task.completed);
  const [dueDate, setDueDate] = useState<Date | null>(task.dueDate);
  const [showPicker, setShowPicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);

  const handleDelete = () => {
    onDelete(task.id);
    navigation.goBack();
  };

  const handleToggleComplete = () => {
    const updatedCompleted = !completed;
    const updatedTask: Task = { ...task, completed: updatedCompleted };
    onUpdate(updatedTask);
    setCompleted(updatedCompleted);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || dueDate;
      setShowPicker(false);
      setDueDate(currentDate);
    } else {
      setShowPicker(false);
    }
  };

  const handlePrioritySelect = (level: string) => {
    setPriority(level);
    setShowPriorityPicker(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.textTitulo}>Título</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
        />
        <Text style={styles.textTitulo}>Descrição</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Descrição"
          multiline
        />

        <Text style={styles.textTitulo}>Data de Vencimento</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateInput}>
          <Text>{dueDate ? dueDate.toLocaleDateString() : "Selecionar Data"}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <Text style={styles.textTitulo}>Prioridade:</Text>
        <TouchableOpacity onPress={() => setShowPriorityPicker(true)} style={[styles.priorityInput, { backgroundColor: priority ? getColor(priority) : '#e0e0e0' }]}>
          <Ionicons name="pricetag" size={24} color="#ffffff" />
          <Text style={styles.priorityText}>
            {priority ? priority : "Selecionar Prioridade"}
          </Text>
        </TouchableOpacity>

        {showPriorityPicker && (
          <View style={styles.priorityOptions}>
            {['Baixa', 'Média', 'Alta'].map((level) => (
              <TouchableOpacity 
                key={level} 
                onPress={() => handlePrioritySelect(level)} 
                style={styles.priorityButton}>
                <Text style={styles.priority}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonComplete} onPress={handleToggleComplete}>
            <Text style={styles.buttonTextComplete}>{completed ? 'Alterar para pendente' : 'Concluir tarefa'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonDelete} onPress={handleDelete}>
            <Text style={styles.buttonTextDelete}>Deletar tarefa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const getColor = (priority: string) => {
  switch (priority) {
    case 'Baixa':
      return '#2D6C4A'; 
    case 'Média':
      return '#FFC107'; 
    case 'Alta':
      return '#F13540'; 
    default:
      return '#e0e0e0'; 
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  textTitulo: {
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  dateInput: {
    padding: 15,
    backgroundColor: '#cce5ff', 
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityInput: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    marginLeft: 10,
    color: '#fff',
  },
  priorityOptions: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  priorityButton: {
    padding: 10,
  },
  priority: {
    color: '#2D6C4A',
  },
  buttonComplete: {
    fontSize: 16,
    backgroundColor: '#4CAF50', 
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    padding: 10,
  },
  buttonDelete: {
    fontSize: 16,
    backgroundColor: '#F13540',
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    padding: 10, 
  },
  buttonTextComplete: {
    color: '#fff',
  },
  buttonTextDelete: {
    fontSize: 16,
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default TaskDetailScreen;

