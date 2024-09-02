import { FC } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface IProps {
  onEmojiSelect: (e: any) => void;
}

const PickerComponent: FC<IProps> = ({ onEmojiSelect }) => {
  return (
    <Picker
      data={data}
      onEmojiSelect={onEmojiSelect}
      style={{
        position: "absolute",
        marginTop: "465px",
        marginLeft: -40,
        maxWidth: "320px",
        borderRadius: "20px",
      }}
      theme="dark"
    />
  );
};

export default PickerComponent;
