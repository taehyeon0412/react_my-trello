import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps) {
  console.log(toDoId, "렌더링됨");
  return (
    <Draggable draggableId={toDoId + ""} index={index}>
      {/* +string => number , number+""=>string */}
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging} //드래그 되는 카드
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {toDoText}
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

/* snapshot 
==> isDragging: boolean
Draggable이 활발하게 드래그 중이거나 드롭 애니메이션인 경우 true로 설정합니다. */

/* ref = reference 
=> 리액트 코드를 이용해 HTML 요소를 지정하고 가져올 수 있는 방법 */
