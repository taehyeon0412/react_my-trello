import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { IToDoState, toDoState } from "./atoms";
import Board from "./components/Board";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  width: auto;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: auto;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const Navigation = styled.div`
  display: flex;
  position: fixed;
  padding: 2.5rem 3rem;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  background-color: ${(props) => props.theme.bgColor};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  transition: color 0.3s;
`;

const ButtonDiv = styled.div`
  display: flex;
  gap: 5px;
`;

const ThemeButton = styled.button``;

const BoardAddButton = styled.button``;

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
    } //같은 보드에서 변경이 있을 경우

    if (destination.droppableId !== source.droppableId) {
      //

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
    } //다른 보드를 건너가서 변경이 있을 경우
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
    setAddToggle((prev) => !prev);
    setValue("boardId", "");
  };

  const onClickAddBoard = () => {
    setAddToggle((prev) => !prev);
  };
  //새로운 보드 추가

  return (
    <>
      <Navigation>
        <Title>Memo Board</Title>
        <ButtonDiv>
          {addingBoard && (
            <form onSubmit={handleSubmit(addBoard)}>
              <input
                {...register("boardId", { required: true })}
                type="text"
                placeholder="이름입력하세요"
              />
            </form>
          )}
          <BoardAddButton onClick={onClickAddBoard}>보드추가</BoardAddButton>
          <ThemeButton>테마버튼</ThemeButton>
        </ButtonDiv>
      </Navigation>

      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
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
