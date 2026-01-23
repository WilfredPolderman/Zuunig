import { Goal } from "../goal";

export interface GoalModalProps {
  visible: boolean;
  goal: Goal | null;
  editName: string;
  editTarget: string;
  onChangeName: (name: string) => void;
  onChangeTarget: (target: string) => void;
  onSave: () => void;
  onDelete: () => void;
  onCancel: () => void;
  colors: any;
}