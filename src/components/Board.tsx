import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { ITodo, toDoState } from "./../atoms";
import { useSetRecoilState } from "recoil";

const ButtonDiv = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  right: 0.4rem;
  gap: 2px;
  transition: opacity 0.3s;
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

const BroadWrapper = styled.div<{ editing?: boolean }>`
  padding-top: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.boardColor};
  min-height: 20rem;
  min-width: 16rem;
  max-width: 16rem;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 15rem);
  &:not(:hover):not(:focus-within) ${ButtonDiv} {
    opacity: 0;
  }
  position: relative;
  &:hover > :first-child,
  &:focus-within > :first-child {
    width: ${(props) => (props.editing ? null : "11.5rem")};
    transition: width 0.3s;
  }
`;
//보드 전체

const CancelButton = styled.button`
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

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 5px;
`;

const TitleSpan = styled.div`
  font-weight: 800;
  margin-bottom: 10px;
  font-size: 1.4rem;
  margin-left: 0.5rem;

  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.3s;
`;

interface IWrapperProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

const Wrapper = styled.ul<IWrapperProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#f3fad2"
      : props.draggingFromThisWith
      ? "#f6a1a6"
      : "transparent"};
  flex-grow: 1;
  /*flex-grow는 0보다 큰 값을 세팅하면 
  Flexible 박스로 변하면서 남은 여백을 메우는 속성*/
  padding: 1rem 0.7rem;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 12rem);
  overflow-x: hidden;
  overflow-y: scroll;
  overflow: overlay;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const EditInput = styled.input`
  height: 2rem;
  width: 100%;
  margin: none;
  border: none;
  padding: none;
  background: transparent;
  outline: transparent;
  font-weight: 700;
`;

const BoardEditForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

interface IBoardProps {
  toDos: ITodo[]; //atoms에 있는 ITodo를 가져옴
  boardId: string;
}

const NewCardForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
`;

const NewCardInput = styled.input`
  width: 100%;
  padding-left: 0.6rem;
  background-color: ${(props) => props.theme.boardColor};
  height: 3rem;
  border-radius: 0rem 0rem 0.5rem 0.5rem;
  border-color: transparent;
  outline: transparent;
  font-weight: 700;
  &:focus {
    border-color: #fdde75;
  }
`;

const NewCardButton = styled.button`
  display: flex;
  position: absolute;
  right: 0%;
  height: 1.8rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  border-color: ${(props) => props.theme.boardColor};
  &:hover {
    background-color: ${(props) => props.theme.buttonColor};
    cursor: pointer;
  }
  i {
    color: #706e6e;
  }
`;

interface IForm {
  toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const setToDos = useSetRecoilState(toDoState); //toDoState를 수정하기 위한것
  const [newBoardName, setNewBoardName] = useState(""); // 보드 이름수정 스테이트
  const [editing, setEditing] = useState(false);

  //사용자가 새로운 카드를 생성하는 newToDo 시작
  const onSubmit = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    /* 이전에 보드에 있던 정보들을 그대로 나두고 현재 속한 board의 정보만
    업데이트 하려면 / 바뀌는 보드id(todo,done등)을 찾고 원래 보드에 있던 
    정보를 리턴, 새로운 정보를 업데이트 해준 뒤 모든 보드를 합쳐준다*/

    setValue("toDo", ""); //submit 후 toDo가 빈값으로 됨
  };
  //사용자가 새로운 카드를 생성하는 newToDo 끝

  // 보드 이름 수정 시작
  const editBoardName = (event: React.FormEvent, boardId: string) => {
    event.preventDefault();
    setToDos((allBoards) => {
      const copyBoards = allBoards;
      const editName = { [boardId]: newBoardName };

      const newBoardsArray = [copyBoards].map((obj) =>
        Object.fromEntries(
          Object.entries(obj).map(([key, value]) => [
            editName[key] ?? key, //??(물음표2개- null,undefine만 리턴)
            value,
          ])
        )
      )[0];

      const newBoards = { ...newBoardsArray };
      return {
        ...newBoards,
      };
    });
    setNewBoardName(""); //빈칸으로 초기화
    setEditing((prev) => !prev);
  };

  /*Object.entries()와 Object.fromEntries()를 순차적으로 적용하면 객체에 배열 전용 메서드를 사용할 수 있다. 
  Object.entries(obj)를 사용해 객체의 키-값 쌍이 요소인 배열을 얻는다.
  */

  const editInput = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewBoardName(value);
  };

  const editButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    boardId: string
  ) => {
    setEditing((prev) => !prev);
  };

  // 보드 이름 수정 끝

  const boardEditCancel = () => {
    setEditing((prev) => false);
  };
  //보드 이름 수정 취소버튼

  const removeBoard = (
    event: React.MouseEvent<HTMLButtonElement>,
    boardId: string
  ) => {
    setToDos((allBoards) => {
      const { [boardId]: _, ...rest } = allBoards;
      /* _ boardId 키가 allBoards 개체에서 제거되어야 함을 지정하는 데 사용
      _변수는 값이 필요하지 않으며 무시할 수 있음을 나타내기 위해
      JavaScript에서 사용되는 규칙 */
      return { ...rest };
    });
  };
  //보드 삭제

  return (
    <BroadWrapper>
      {editing ? (
        <Title>
          <BoardEditForm
            onSubmit={(event) => {
              editBoardName(event, boardId);
            }}
          >
            <EditInput
              type="text"
              placeholder={`  보드명을 입력해 주세요.`}
              onChange={editInput}
              required
            />
            <ButtonDiv>
              <CancelButton type="button" onClick={boardEditCancel}>
                <i className="fa-solid fa-circle-xmark"></i>
              </CancelButton>
            </ButtonDiv>
          </BoardEditForm>
        </Title>
      ) : (
        <Title>
          <TitleSpan>{boardId}</TitleSpan>
          <ButtonDiv>
            <Button
              onClick={(event) => {
                editButtonClick(event, boardId);
              }}
            >
              <i className="fa-solid fa-pen"></i>
            </Button>
            <Button
              onClick={(event) => {
                removeBoard(event, boardId);
              }}
            >
              <i className="fa-solid fa-trash"></i>
            </Button>
          </ButtonDiv>
        </Title>
      )}

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
                todoId={toDo.id}
                todoText={toDo.text}
                boardId={boardId}
              />
              //DraggableCard 컴포넌트
              /* DroppableBoard(Board)에서 DraggableCard(Card)로 
              props를 전달할 때 todo 객체를 통채로 보내면 에러가 발생할 수 있으므로 
              객체에서 값을 꺼내서 따로따로 보내야 함. 
              todo={todo} (X)
              todoId={todo.id} todoText={todo.text} (O)*/
            ))}
            {provided.placeholder}
          </Wrapper>
        )}
      </Droppable>
      <NewCardForm onSubmit={handleSubmit(onSubmit)}>
        <NewCardInput
          {...register("toDo", { required: true })}
          type="text"
          placeholder={`${boardId} 추가하기`}
        />
        <NewCardButton>
          <i className="fa-solid fa-plus"></i>
        </NewCardButton>
      </NewCardForm>
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
