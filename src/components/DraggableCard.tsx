import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div`
  background-color: ${(props) => props.theme.cardColor};
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
`;

interface IDraggableCardProps {
  toDo: string;
  index: number;
}

function DraggableCard({ toDo, index }: IDraggableCardProps) {
  return (
    <Draggable key={toDo} draggableId={toDo} index={index}>
      {(provided) => (
        <Card ref={provided.innerRef} {...provided.draggableProps}>
          <span {...provided.dragHandleProps}>💗</span>
          {toDo}
        </Card>
      )}
    </Draggable>
  );
}

export default DraggableCard;
