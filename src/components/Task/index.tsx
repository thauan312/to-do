import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task as TaskType } from '../../../types';

enum Priority {
  Alta = 'Alta',
  Média = 'Média',
  Baixa = 'Baixa',
}

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  dueDate: Date | null; 
}

interface TaskItemProps {
  task: TaskType;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void; 
}

export default function TaskItem({ task, onDelete, onToggleComplete }: TaskItemProps) {
  const priorityColor = task.priority === Priority.Alta ? '#F13540' : 
                        task.priority === Priority.Média ? '#FFC107' : 
                        '#2D6C4A';

  // Formatação da data
  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }) : 'Sem data definida'; // Mensagem caso não haja data

  return (
    <View style={styles.taskContainer}>
      <View style={[styles.priorityIndicator, { backgroundColor: priorityColor }]} />
      <TouchableOpacity 
        onPress={() => onToggleComplete(task.id)} 
        style={styles.completeButton}
        accessibilityLabel={task.completed ? "Marcar como pendente" : "Concluir tarefa"}
        accessibilityHint="Altera o status da tarefa"
      >
        <Ionicons 
          name={task.completed ? "checkmark-circle" : "ellipse-outline"} 
          size={20} 
          color={task.completed ? "#2D6C4A" : "#A8CDF9"} 
        />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={[styles.taskTitle, task.completed && styles.completedTitle]}>
          {task.title}
        </Text>
        <View style={styles.dueDateContainer}>
          <Text style={styles.dueDate}>
            {formattedDate}
          </Text>
        </View>
      </View>
      <TouchableOpacity 
        onPress={() => onDelete(task.id)} 
        style={styles.deleteButton}
        accessibilityLabel="Deletar tarefa"
        accessibilityHint="Remove a tarefa da lista"
      >
        <Ionicons name="trash" size={24} color="#dc3545" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  priorityIndicator: {
    width: 15,
    height: '100%',
    borderBottomStartRadius: 8,
    borderTopStartRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  taskTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1D1D1D',
  },
  dueDateContainer: {
    backgroundColor: '#A8CDF9', 
    borderRadius: 12, 
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 8,
    alignSelf: 'flex-start', 
  },
  dueDate: {
    fontSize: 10,
    color: '#005CC9', 
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  completeButton: {
    marginHorizontal: 10,
  },
  deleteButton: {
    paddingEnd: 10,
  },
});
