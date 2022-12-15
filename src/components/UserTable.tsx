import { useEffect, useState } from "react";

interface UserType {
  id: number;
  name: string;
  username: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export const UserTable = () => {
  const [users, setUsers] = useState<Array<UserType>>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      const users = (await response.json()) as Array<UserType>;
      setUsers(users);
    };
    getUsers();
  }, []);

  const pushUser = () => {
    setUsers((prevUsers) => {
      let newUsers = [...prevUsers];
      newUsers.push({
        id: 0,
        name: "",
        username: "",
        email: ""
      });
      return newUsers;
    });
  };

  const dragStart = (index: number) => {
    setDragIndex(index);
  };

  const dragEnter = (index: number) => {
    if (index === dragIndex) return;
    setUsers((prevUsers) => {
      let newUsers = [...prevUsers];
      const deleteElement = newUsers.splice(dragIndex ?? 0, 1)[0];
      newUsers.splice(index, 0, deleteElement);
      return newUsers;
    });
    setDragIndex(index);
  };

  const dragEnd = () => {
    setDragIndex(null);
  };

  const sendUsers = () => {
    console.log("ここにサーバへの並び替え後のデータ送信処理を追加");
    console.table(users);
  };

  const setUserAttr = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setUsers((prevUsers) => {
      let newUsers = [...prevUsers];
      newUsers[index][event.target.name] = event.target.value;
      return newUsers;
    });
  };

  return (
    <div style={{ margin: "2em" }}>
      <button onClick={pushUser}>ユーザー追加</button>
      <button onClick={sendUsers}>変更を確定</button>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名前</th>
            <th>ユーザ名</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={index}
              draggable={true}
              onDragStart={() => dragStart(index)}
              onDragEnter={() => dragEnter(index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnd={dragEnd}
              className={index === dragIndex ? "dragging" : ""}
            >
              <td>{user.id !== 0 ? user.id : null}</td>
              <td>
                <input
                  type="text"
                  value={user.name}
                  name="name"
                  onChange={(event) => setUserAttr(event, index)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.username}
                  name="username"
                  onChange={(event) => setUserAttr(event, index)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.email}
                  name="email"
                  onChange={(event) => setUserAttr(event, index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
