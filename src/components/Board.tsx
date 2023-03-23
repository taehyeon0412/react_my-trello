import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";

const BroadWrapper = styled.div`
  padding: 20px 10px;
  padding-top: 30px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.boardColor};
  min-height: 200px;
`;

const Wrapper = styled.div``;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IBoardProps {
  toDos: string[];
  boardId: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  return (
    <BroadWrapper>
      <Title>{boardId}</Title>
      <Droppable droppableId={boardId}>
        {(provided) => (
          <Wrapper ref={provided.innerRef} {...provided.droppableProps}>
            {toDos.map((toDo, index) => (
              <DraggableCard key={toDo} index={index} toDo={toDo} />
              //DraggableCard 컴포넌트
            ))}
            {provided.placeholder}
          </Wrapper>
        )}
      </Droppable>
    </BroadWrapper>
  );
}

export default Board;
