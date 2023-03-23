import React from "react";
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
  console.log(toDo, "렌더링됨");
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

export default React.memo(DraggableCard);

/*dnd를 하면 부모 state등이 바뀌는데 그때 모든 카드들이 렌더링을 다시 하게되어
반응이 느려진다 이러한 현상을 막기위해 memo 함수를 이용하여 
렌더링을 막아준다
props가 바뀌지 않는다면 렌더링을 하지 않게 함 (위치를 바꾸면 index가 바뀜)
React.memo(DraggableCard);
 */
