import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Modal, Alert, StyleSheet, Picker } from 'react-native';
import { Card, Title, Paragraph, Button, Portal, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [subtask, setSubtask] = useState('');
  const [status, setStatus] = useState('TO DO');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          title: newTask,
          description: taskDescription,
          subtasks: subtasks,
          status: status,
        },
      ]);
      setNewTask('');
      setTaskDescription('');
      setSubtasks([]);
      setStatus('TO DO');
    }
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTask(taskId);
      setTaskTitle(taskToEdit.title);
      setTaskDescription(taskToEdit.description);
      setSubtasks(taskToEdit.subtasks);
      setStatus(taskToEdit.status);
    }
  };

  const saveTaskChanges = () => {
    if (editingTask !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask
            ? {
                ...task,
                title: taskTitle,
                description: taskDescription,
                subtasks: subtasks,
                status: status,
              }
            : task
        )
      );
      setEditingTask(null);
      setTaskTitle('');
      setTaskDescription('');
      setSubtasks([]);
      setStatus('TO DO');
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const addSubtask = () => {
    if (subtask.trim() !== '') {
      setSubtasks([...subtasks, subtask]);
      setSubtask('');
    }
  };

  const removeSubtask = (subtaskIndex) => {
    const updatedSubtasks = subtasks.filter((_, index) => index !== subtaskIndex);
    setSubtasks(updatedSubtasks);
  };

  const openEditModal = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setEditModalVisible(true);
    }
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };

  const handleEditTask = () => {
    // Handle edit action here, you can add your custom logic
    closeEditModal();
  };

  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteTask(selectedTask.id);
            closeEditModal();
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        {/* Left side: Displaying the List of Tasks */}
        <View style={styles.leftContainer}>
          <Text style={styles.todoText}>
            Todo ({tasks.length})
          </Text>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Title style={styles.taskTitle} onPress={() => openEditModal(item.id)}>
                    {item.title}
                  </Title>
                  <Paragraph style={styles.subtasksText}>Subtasks: {item.subtasks.length}</Paragraph>
                </Card.Content>
              </Card>
            )}
          />
        </View>

        {/* Right side: Add New Task */}
        <View style={styles.rightContainer}>
  <Title style={styles.boldText}>Add New Task</Title>

  {/* Title Input with shadow */}
  <View style={styles.textInputContainer}>
    <Title style={styles.smallText}>Title</Title>
    <TextInput
      label="Title"
      value={editingTask !== null ? taskTitle : newTask}
      onChangeText={editingTask !== null ? setTaskTitle : setNewTask}
      style={styles.textInput}
    />
  </View>

  {/* Description Input with shadow */}
  <View style={styles.textInputContainer}>
    <Title style={styles.smallText}>Description</Title>
    <TextInput
      label="Description"
      value={taskDescription}
      onChangeText={setTaskDescription}
      style={styles.textInput}
    />
  </View>

  
          {/* Subtasks Input and List */}
          <View style={styles.textInputContainer}>
  <Title style={styles.smallText}>Subtasks</Title>
  {subtasks.map((subtask, index) => (
    <View key={index} style={styles.subtaskItemContainer}>
      <Paragraph style={styles.subtaskText}>- {subtask}</Paragraph>
      <Icon
        name="times"
        size={25}
        color="grey"
        onPress={() => removeSubtask(index)}
      />
    </View>
  ))}
  <TextInput
    label="Add Subtask"
    value={subtask}
    onChangeText={setSubtask}
    style={styles.textInput}
  />
 <Button
  mode="outlined"
  onPress={addSubtask}
  style={{ backgroundColor: 'white' }}
>
  + Add New Subtask
</Button>
</View>
          {/* Status Picker */}
          <View style={styles.statusContainer}>
  <Title style={styles.smallText}>Status</Title>
  <Picker
    selectedValue={status}
    onValueChange={(itemValue) => setStatus(itemValue)}
    style={styles.picker}
  >
    <Picker.Item label="TO DO" value="TO DO" style={styles.pickerItem} />
    <Picker.Item label="IN PROGRESS" value="IN PROGRESS" style={styles.pickerItem} />
    <Picker.Item label="COMPLETED" value="COMPLETED" style={styles.pickerItem} />
  </Picker>
</View>
          {editingTask !== null ? (
            <Button style={styles.saveButton} mode="outlined" onPress={saveTaskChanges}>
              Save Changes
            </Button>
          ) : (
            <Button
  style={{ ...styles.addButton, backgroundColor: '#4e3e73' }}
  mode="outlined"
  onPress={addTask}
>
  Create Task
</Button>
          )}
        </View>
      </View>
  
      {/* Edit Task Modal */}
      <Portal>
        <Modal
          visible={isEditModalVisible}
          onDismiss={closeEditModal}
        >
          <View style={styles.modalContainer}>
            <Title style={styles.modalTitle}>Edit Task</Title>
            <Paragraph style={styles.modalText}>{selectedTask && selectedTask.title}</Paragraph>
            <Button style={styles.modalButton} mode="outlined" onPress={handleEditTask}>Edit</Button>
            <Button style={styles.modalButton} mode="outlined" onPress={handleDeleteTask}>Delete</Button>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'row',
    padding: 16,
  },
  leftContainer: {
    flex: 0.3,
    padding: 20,
    backgroundColor: 'black',
  },
  rightContainer: {
    flex: 0.3,
    padding: 20,
    backgroundColor: '#2e2c34',
    justifyContent: 'space-between',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 16,
  },
  todoText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  smallText: {
    fontSize: 12,
  },
  card: {
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 20,
  },
  subtasksText: {
    fontSize: 10,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    color: 'white',
  },
  subtaskText: {
    fontSize: 14,
    flex: 2,
  },
  addButton: {
    marginTop: 16,
  },
  saveButton: {
    marginTop: 16,
  },
  modalContainer: {
    backgroundColor: 'grey',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  modalText: {
    fontSize: 16,
    
  },
  modalButton: {
    marginTop: 16,
  },
  statusContainer: {
    backgroundColor: '#2e2c34',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#66626f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  picker: {
    color: '#2e2c34',
  },
  pickerItem: {
    backgroundColor: '#2e2c34',
    color: '#2e2c34',
  },
  textInputContainer: {
    backgroundColor: '#2e2c34',
    borderRadius: 6,
    padding: 12,
    marginBottom: 5,
    shadowColor: '#66626f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    justifyContent: 'space-between',
  },
  subtaskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    
    marginBottom: 10, // Add margin to create space
    backgroundColor: '#2e2c34',
    shadowColor: '#66626f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textInput: {
    fontSize: 16,
    height: 40,
  },
});

export default HomePage;