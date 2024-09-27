export type RootStackParamList = {
    Home: undefined; 
    Detalhes: { task: Task; onDelete: (id: string) => void; onUpdate: (updatedTask: Task) => void; }; 
  };
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    priority: string;
    completed: boolean;
    dueDate: Date | null;
    
  }