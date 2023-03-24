import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import React from "react";
import { ITodo } from "./../atoms";

const BroadWrapper = styled.div`
  padding-top: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.boardColor};
  min-height: 200px;
  display: flex;
  flex-direction: column;
`;

interface IWrapperProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Wrapper = styled.div<IWrapperProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.draggingFromThisWith
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  /*flex-grow는 0보다 큰 값을 세팅하면 
  Flexible 박스로 변하면서 남은 여백을 메우는 속성*/
  padding: 20px;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IBoardProps {
  toDos: ITodo[]; //atoms에 있는 ITodo를 가져옴
  boardId: string;
}

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
  }
`;

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const onSubmit = ({ toDo }: IForm) => {
    setValue("toDo", "");
  };

  return (
    <BroadWrapper>
      <Title>{boardId}</Title>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`추가 할 ${boardId}`}
        />
      </Form>

      <Droppable droppableId={boardId}>
        {(provided, snapshot) => (
          <Wrapper
            isDraggingOver={snapshot.isDraggingOver}
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            //보드에서 드래그되어 벗어나고 있는 보드를 true,false로 나타내줌
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
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

/* snapshot 
==> isDragging: boolean
Draggable이 활발하게 드래그 중이거나 드롭 애니메이션인 경우 true로 설정합니다.

isDraggingOver: boolean
현재 선택한 Draggable이 특정 Droppable위에 드래깅 되고 있는지 여부 확인

draggingOverWith: ?DraggableId
Droppable 위로 드래그하는 Draggable ID

draggingFromThisWith: ?DraggableId
현재 Droppable에서 벗어난 드래깅되고 있는 Draggable ID

isUsingPlaceholder: boolean
placeholder가 사용되고 있는지 여부
*/
