const users = [];

/* 유저 추가하기 */
// return 값은 error 이거나 user 이다.
const addUser = ({ id, name, room }) => {
  // name = name.trim().toLowerCase(); 확인필요
  // room = room.trim().toLowerCase(); 확인필요
  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  ); // 새 사용자가 동일한 사용자 이름으로 같은 방에 등록하려고 시도할 경우

  if (existingUser) {
    return { error: '이미 사용중인 이름입니다.' };
  }

  const user = { id, name, room };
  users.push(user);

  return { user };
};

/* 유저 삭제하기 */
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id); // findIndex를 만족하지 않으면 -1을 반환

  if (index !== -1) {
    return users.splice(index, 1)[0];
  } // 사용자 배열에서 해당 사용자를 제거
};

const getUser = (id) => users.find((user) => user.id === id); // 해당 사용자가 id와 같으면 사용자가 존재함

const getUsersInRoom = (room) => users.filter((user) => user.room === room); // 해당 방의 모든 사용자를 돌린다.

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
