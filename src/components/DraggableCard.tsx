import React, { useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { toDoState } from "../atoms";
import { useForm } from "react-hook-form";

const ButtonDiv = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  right: 0.4rem;
  gap: 2px;
  height: 100%;
`;

const Button = styled.button`
  height: 2rem;
  width: 2rem;
  border-color: transparent;
  border-radius: 0.5rem;
  background-color: transparent;
  &:hover {
    background-color: ${(props) => props.theme.buttonColor};
    cursor: pointer;
  }
  i {
    color: #706e6e;
  }
`;

const Card = styled.div<{ isDragging: boolean }>`
  background-color: ${(props) =>
    props.isDragging ? "#74b9ff" : props.theme.cardColor};
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  &:not(:hover):not(:focus-within) ${ButtonDiv} {
    opacity: 0;
  }
`;

interface IDraggableCardProps {
  index: number;
  todoId: number;
  todoText: string;
  boardId: string;
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 5px;
`;

interface IForm {
  toDo: string;
}

const Form = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin: none;
`;

const Input = styled.input`
  width: 100%;
  height: auto;
  margin: none;
  border: none;
  padding: none;
  background: transparent;
  outline: transparent;
`;

const CancelButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.7rem;
  width: 1.7rem;
  border-color: transparent;
  border-radius: 0.5rem;
  background-color: transparent;
  &:hover {
    background-color: ${(props) => props.theme.buttonColor};
    cursor: pointer;
  }
  i {
    color: #706e6e;
  }
`;

function DraggableCard({
  todoText,
  todoId,
  index,
  boardId,
}: IDraggableCardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const [editing, setEdit] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onValid = ({ toDo }: IForm) => {
    const editToDo = {
      id: todoId,
      text: toDo,
    };

    setToDos((allBoards) => {
      const boardCopy = [...allBoards[boardId]];
      boardCopy[index] = editToDo;

      return {
        ...allBoards,
        [boardId]: boardCopy,
      };
    });
    setValue("toDo", "");
    setEdit((prev) => false);
  };

  const cardEdit = () => {
    setEdit((prev) => true);
  };
  //카드 수정하기

  const cardEditCancel = (event: any) => {
    setEdit((prev) => false);
    setValue("toDo", "");

    if (event.key === `Enter`) {
      event.preventDefault();
    }
  };
  //수정시 취소버튼

  const cardDelete = () => {
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId].filter((toDo) => toDo.id !== todoId)],
        //클릭한 todo.id와 같지 않은것만 다시 배열로 나타냄
      };
    });
  };
  //카드 지우기

  console.log(boardId, todoId, todoText, index);

  return (
    <Draggable draggableId={todoId + ""} index={index}>
      {/* +string => number , number+""=>string */}
      {(provided, snapshot) => (
        <Card
          isDragging={snapshot.isDragging} //드래그 되는 카드
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {editing ? (
            <Wrapper>
              <Form onSubmit={handleSubmit(onValid)}>
                <Input
                  {...register("toDo", { required: true })}
                  type="text"
                  placeholder="새로운 할 일을 적어주세요."
                />
              </Form>
              <CancelButton onClick={cardEditCancel}>
                <i className="fa-solid fa-circle-xmark"></i>
              </CancelButton>
            </Wrapper>
          ) : (
            <>
              {todoText}
              <ButtonDiv>
                <Button onClick={cardEdit}>
                  <i className="fa-solid fa-pen"></i>
                </Button>
                <Button onClick={cardDelete}>
                  <i className="fa-solid fa-trash"></i>
                </Button>
              </ButtonDiv>
            </>
          )}
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
