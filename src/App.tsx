import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import styled, { createGlobalStyle } from "styled-components";
import { useRecoilState } from "recoil";
import { IToDoState, toDoState } from "./atoms";
import Board from "./components/Board";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Modal from "react-modal";

const GlobalStyle = createGlobalStyle`
html{
  @media screen and (max-width: 600px) {
    font-size: 80%;
  }
  @media screen and (max-height: 600px) {
    font-size: 70%;
  }
}
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
ml, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
*{
  box-sizing:border-box;
}
body{
  font-family: 'Source Sans Pro', sans-serif;
  background-image: radial-gradient(circle at 10% 10%, #4a95f6 10%,#4665ca 40%, #403798 80%,#4a95f6 100%);
  color: black;
}
a{
  text-decoration:none;
  color:inherit; //부모 색깔을 가져와서 링크를 눌러도 색깔이 변하지않음
}
`;

const FullScreen = styled.div`
  height: 100vh;
  width: 100vw;
  overflow-x: scroll;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    width: 0.6rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bababa;
    border-radius: 1rem;
    background-clip: padding-box;
    border: 0.2rem solid transparent;
    transition: background-color 0.3s;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: auto;
  margin: 0 auto;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 3rem;
  margin-left: 2rem;
  gap: 1rem;
`;

const Navigation = styled.div`
  display: flex;
  top: 0;
  left: 0;
  right: 0;
  padding: 2.5rem 3rem;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  transition: color 0.3s;
`;

const NvButtonDiv = styled.div`
  display: flex;
  gap: 5px;
`;

const BoardAddButton = styled.button`
  position: absolute;
  top: 2.5rem;
  right: 5%;
  height: 2.5rem;
  width: 2.5rem;
  border-color: transparent;
  border-radius: 2rem;
  background-color: ${(props) => props.theme.boardColor};
  outline: transparent;
  box-shadow: 3px 3px 3px black;
  &:active {
    margin-left: 5px;
    margin-top: 5px;
    box-shadow: none;
  }
  &:hover {
    background-color: ${(props) => props.theme.bgColor};
    cursor: pointer;
  }
  i {
    color: #706e6e;
  }
`;

const AddBoardTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3rem;
  h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const AddBoardCancelBtn = styled.button`
  position: absolute;
  right: 1rem;
  width: 2rem;
  height: 2rem;
  border: transparent;
  border-radius: 20px;
  background-color: ${(props) => props.theme.buttonColor};
  &:hover {
    background-color: ${(props) => props.theme.cardColor};
    cursor: pointer;
  }
  box-shadow: 3px 3px 3px black;
  &:active {
    margin-left: 5px;
    margin-top: 5px;
    box-shadow: none;
  }
`;

const AddBoardForm = styled.form`
  input {
    margin-top: 3rem;
    width: 100%;
    height: 3rem;
    padding-left: 1rem;
    border-radius: 10px;
    border: transparent;
    outline: transparent;
  }
`;

const modalCustomStyles = {
  content: {
    backgroundColor: "#f5f5f5",
    borderRadius: "1.5rem",
    width: "25rem",
    height: "12.5rem",
    top: "50%",
    left: "50%",
    transform: "translate(-12.5rem, -6.25rem)",
  },
};
//보드 모달 css

const Trash = styled.div`
  position: absolute;
  top: 0%;
  height: 2rem;
  width: 5rem;
  border-radius: 0 0 2rem 2rem;
  left: 50%;
  transform: translate(-50%, -0%);
  transition: 0.3s;
  background-color: ${(props) => props.theme.boardColor};
  &:hover {
    height: 9rem;
    width: 15rem;
    background-color: transparent;
  }
  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
//쓰레기통

const DropArea = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 0 0 2rem 2rem;
  transition: 0.5s;
  opacity: 0;
  &:hover {
    background-color: tomato;
    opacity: 100;
  }
`;
//쓰레기통 안 드래그 영역

interface IAddBoard {
  boardId: string;
}

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { draggableId, destination, source } = info;

    /* console.log(info); */

    if (!destination) return;
    ///destination이 아닐결우 = 드롭한 곳이 똑같은 위치일경우 그냥 리턴한다

    if (destination?.droppableId === source.droppableId) {
      //

      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        //source.droppableId로 부터 array를 복사함
        //droppableId ==> array 이름 (To Do,doing등등)
        const taskObj = boardCopy[source.index];
        //boardCopy[source.index]에 있는 오브젝트를 받아옴
        //source.index는 시작지점 index 번호
        //boardCopy가 splice로 삭제되기전에 오브젝트들을 taskObj에 넣어둔다

        boardCopy.splice(source.index, 1);
        //source.index는 시작지점 index 번호
        boardCopy.splice(destination?.index, 0, taskObj);
        //destination.index는 드롭한 위치 index 번호
        /* draggableId는 toDo이다 단순 string일때는 (예시=> todo:["a","b"]) 
        (destination?.index, 0, draggableId)로 쓰면 되는데
        단순 string --> ToDoList로 바뀌면 array로 이루어진 board(오브젝트)라고 
        알려주어야된다 그게 taskObj이다*/

        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        //수정된 보드(boardCopy) + 다른 보드들도 모두 불러와야 된다(allBoards)
        /* [source.droppableId]: boardCopy에서 
        [키]:표현식은 es6 문법이다 key값에 표현식(변수,함수등)을 지정하는문법 
        "To Do": boardCopy로 js는 알아듣는다
        정리하면 splice로 변경된 boardCopy를 source.droppableId에 넣는다는뜻*/
      });
    }
    //같은 보드에서 변경이 있을 경우

    if (destination.droppableId !== source.droppableId) {
      if (destination.droppableId === "contentTrashDropId") {
        setToDos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          boardCopy.splice(source.index, 1);
          return { ...allBoards, [source.droppableId]: boardCopy };
        });
      }
      //droppableId가 contentTrashDropId 일때 쓰레기통 기능
      else {
        setToDos((allBoards) => {
          const sourceBoard = [...allBoards[source.droppableId]];
          //시작지점(드래그지점)
          const taskObj = sourceBoard[source.index];
          //sourceBoard[source.index]에 있는 오브젝트를 받아옴
          //source.index는 시작지점 index 번호
          const destinationBoard = [...allBoards[destination.droppableId]];
          //끝지점(드롭지점)
          sourceBoard.splice(source.index, 1);
          destinationBoard.splice(destination?.index, 0, taskObj);

          return {
            ...allBoards,
            [source.droppableId]: sourceBoard,
            [destination.droppableId]: destinationBoard,
          };
        });
      }
    }
    //다른 보드를 건너가서 변경이 있을 경우
  };

  const { register, setValue, handleSubmit } = useForm<IAddBoard>();
  //보드 추가 폼
  const [addingBoard, setAddToggle] = useState(false);
  /* 버튼을 클릭할때 input이 나오면서 보드가 추가 되야되므로 if문을 이용할 수 있게
      useState를 이용한다 */
  const addBoard = ({ boardId }: IAddBoard) => {
    setToDos((allBoards) => {
      const newAddBoard: IToDoState = { [boardId]: [] };

      return {
        ...allBoards,
        ...newAddBoard,
      };
    });
    setAddToggle(false);
    setValue("boardId", "");
  };

  const onClickAddBoard = () => {
    setAddToggle(true);
    openModal();
  };
  //새로운 보드 추가

  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  //모달

  return (
    <>
      <GlobalStyle />
      <FullScreen>
        {addingBoard && (
          <Modal
            isOpen={modalIsOpen}
            ariaHideApp={false}
            onRequestClose={closeModal}
            style={modalCustomStyles}
          >
            <AddBoardTitle>
              <h1>보드 추가</h1>
              <AddBoardCancelBtn onClick={closeModal}>x</AddBoardCancelBtn>
            </AddBoardTitle>
            <AddBoardForm onSubmit={handleSubmit(addBoard)}>
              <input
                {...register("boardId", { required: true })}
                type="text"
                placeholder="보드를 추가하세요."
              />
            </AddBoardForm>
          </Modal>
        )}

        <Navigation>
          <Title>Memo Board</Title>
          <NvButtonDiv>
            <BoardAddButton onClick={onClickAddBoard}>
              <i className="fa-solid fa-plus"></i>
            </BoardAddButton>
          </NvButtonDiv>
        </Navigation>

        <DragDropContext onDragEnd={onDragEnd}>
          <Wrapper>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Wrapper>

          <Trash>
            <i className="fa-solid fa-trash"></i>
            <Droppable droppableId="contentTrashDropId">
              {(trashDrop) => (
                <DropArea
                  ref={trashDrop.innerRef}
                  {...trashDrop.droppableProps}
                >
                  {trashDrop.placeholder}
                </DropArea>
              )}
            </Droppable>
          </Trash>

          {/*  */}
        </DragDropContext>
      </FullScreen>
    </>
  );
}

export default App;

/* {provided.placeholder}==>
Draggable 엘리먼트를 드래그하는 동안 
position: fixed(영역을 고정시킴)를 적용합니다. */

/* splice 함수는 (지우는 인덱스 시작 숫자, 지우는 개수, 더하는 아이템)으로 사용한다
x.splice(0,1)이라면 인덱스0번부터 아이템 1개를 삭제한다라는 뜻
x.splice(1,0,"a")이라면 인덱스 1번부터 시작하여 0개의 아이템을 지우고 그자리에
a를 추가한다는 뜻이다  */

/* 1개의 보드만 사용할때 방법

      if (!destination) return;
      //destination이 아닐결우 = 드롭한 곳이 똑같은 위치일경우 그냥 리턴한다

      setToDos((oldToDos) => {
      const toDosCopy = [...oldToDos]; //...oldToDos는 모든값들을 쓴다는뜻
      /* dnd 후 자리가 변경되게 하려면 드래그한 아이템을 삭제 후 
      드랍한 위치에 다시 추가해주는 방법을 쓰면된다 splice사용

      toDosCopy.splice(source.index, 1);
      //source.index는 드래그한 index 번호

      toDosCopy.splice(destination?.index, 0, draggableId);
      //destination.index는 드롭한 위치 index 번호
      //draggableId는 toDo이다

      return toDosCopy;
    }); */

/*--------------------------------------------------------------*/

/*여러개의 보드를 사용하고 같은 보드에 변경이 있을때 방법
1. 변경이 일어난 보드만 복사한다. => boardCopy
2. 변경이 일어난 보드의 복사본을 기존에 있던 보드옆에 붙여준다 => allBoards
*/

/*여러개의 보드를 사용하고 다른 보드에 변경이 있을때 방법
1. 변경이 일어난 보드들을 복사한다. => source(드래그),destination(드롭) 2가지보드
2. 변경이 일어난 보드들의 복사본을 기존에 있던 보드옆에 붙여준다 => allBoards
*/

/* [source.droppableId]: boardCopy에서 
        [키]:표현식은 es6 문법이다 key값에 표현식(변수,함수등)을 지정하는문법 */

/*Object.keys() =>> 오브젝트가 가진 키가 나옴*/
