import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, TouchableWithoutFeedback } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

interface AddTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddTask: (task: string, description: string, priority: string, dueDate: Date | null) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isVisible, onClose, onAddTask }) => {
  const [task, setTask] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<string>('Baixa');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityModal, setShowPriorityModal] = useState(false); // Estado do popup

  const resetForm = () => {
    setTask('');
    setDescription('');
    setDueDate(null);
    onClose();
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      Alert.alert("Título da Tarefa", "Por favor, insira um título para a tarefa.");
      return;
    }
    if (dueDate && dueDate < new Date()) {
      Alert.alert("Data Vencimento", "Por favor, selecione uma data válida.");
      return;
    }
    onAddTask(task, description, priority, dueDate);
    resetForm();
  };

  const getColor = (priority: string) => {
    switch (priority) {
      case 'Baixa':
        return '#2D6C4A'; 
      case 'Média':
        return '#FFC107'; 
      case 'Alta':
        return '#F13540'; 
  
    }
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Nova Tarefa</Text>
              <TextInput
                style={styles.input}
                placeholder="Título da Tarefa"
                value={task}
                onChangeText={setTask}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição da Tarefa"
                value={description}
                onChangeText={setDescription}
              />

              <TouchableOpacity style={styles.priorityButton} onPress={() => setShowPriorityModal(true)}>
                <Ionicons name="pricetag" size={24} color={getColor(priority)} />
                <Text style={styles.priorityText}>{priority}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Ionicons name="calendar-outline" size={24} color="#2D6C4A" />
                <Text style={styles.dateText}>{dueDate ? dueDate.toLocaleDateString() : "Selecione uma Data"}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dueDate ? new Date(dueDate) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    setDueDate(selectedDate || dueDate);
                  }}
                />
              )}

              <TouchableOpacity style={styles.sendButton} onPress={handleAddTask}>
                <Ionicons name="send" size={24} color="#10B981" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>

      <Modal
        visible={showPriorityModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPriorityModal(false)}>
          <View style={styles.priorityModalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.priorityModalContent}>
                <Text style={styles.priorityModalTitle}>Selecione a Prioridade</Text>
                <View style={styles.priorityOptions}>
                  <TouchableOpacity
                    style={[styles.priorityOption, { backgroundColor: 'green' }]}
                    onPress={() => {
                      setPriority('Baixa');
                      setShowPriorityModal(false);
                    }}
                  >
                    <Text style={styles.priorityOptionText}>Baixa</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.priorityOption, { backgroundColor: 'orange' }]}
                    onPress={() => {
                      setPriority('Média');
                      setShowPriorityModal(false);
                    }}
                  >
                    <Text style={styles.priorityOptionText}>Média</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.priorityOption, { backgroundColor: 'red' }]}
                    onPress={() => {
                      setPriority('Alta');
                      setShowPriorityModal(false);
                    }}
                  >
                    <Text style={styles.priorityOptionText}>Alta</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  priorityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  priorityText: {
    fontSize: 16,
    marginLeft: 10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
    alignItems: 'flex-end',
  },
  priorityModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  priorityModalContent: {
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  priorityModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  priorityOptions: {
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  priorityOption: {
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  priorityOptionText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default AddTaskModal;
