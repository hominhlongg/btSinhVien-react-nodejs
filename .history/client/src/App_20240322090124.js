import { useState, useEffect } from 'react';
import axios from 'axios';

const studentsApi = 'http://localhost:3001/students';

function App() {
    const [listStudent, setListStudent] = useState([]);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorAddress, setErrorAddress] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                let student = await axios(studentsApi);
                setListStudent(student.data);
            } catch (err) {
                setError('Xảy ra lỗi khi lấy dữ liệu!');
            }
        }
        fetchData();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        function generateUuid() {
            return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
                let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 || 0x8);
                return v.toString(16);
            });
        }
        let check = true;
        if (!name) {
            setErrorName('Vui lòng nhập tên');
            check = false;
        }
        if (!address) {
            setErrorAddress('Vui lòng nhập địa chỉ');
            check = false;
        }

        if (check) { // if validate is true
            // if edit
            if (isEdit) {
                let newStu = {
                    id,
                    name,
                    address
                }
                try {
                    await axios({
                        method: "PUT",
                        url: studentsApi + "/" + id,
                        data: newStu
                    })
                    let newList = [...listStudent];
                    let idx = newList.findIndex(student => student.id === id);
                    newList.splice(idx, 1, newStu);
                    setListStudent(newList);
                    setId('');
                    setName('');
                    setAddress('');
                    setIsEdit(false);
                } catch (error) {
                    setError('Xảy ra lỗi khi sửa!');
                }
            } else {
                //if add
                let newStu = {
                    id: generateUuid(),
                    name,
                    address
                }
                try {
                    await axios({
                        method: "POST",
                        url: studentsApi,
                        data: newStu
                    })
                    let newList = [
                        ...listStudent,
                        newStu
                    ]
                    setListStudent(newList);
                    setName('');
                    setAddress('');
                } catch (error) {
                    setError('Xảy ra lỗi khi thêm!');
                }
            }
        }
    }

    function handleBlur(e) {
        if (e.target.name === 'name') {
            if (!e.target.value) {
                setErrorName('Vui lòng nhập tên');
            }
        } else if (e.target.name === 'address') {
            if (!e.target.value) {
                setErrorAddress('Vui lòng nhập địa chỉ');
            }
        }
    }

    function handleInput(e) {
        if (e.target.name === 'name') {
            setErrorName('');
        } else if (e.target.name === 'address') {
            setErrorAddress('');
        }
    }

    function handleClickEdit(student) {
        // console.log(student);
        setId(student.id);
        setName(student.name);
        setAddress(student.address);
        setIsEdit(true);
    }

    async function handleDelete(student) {
        if (window.confirm('Ban co muon xoa sinh vien nay? Y/N')) {
            try {
                await axios({
                    method: "DELETE",
                    url: studentsApi + '/' + student.id
                })
                //filter loc ra cac sinh vien co ID khac voi SV da xoa
                let newList = listStudent.filter(std => std.id !== student.id);
                setListStudent(newList);
            } catch (error) {
                setError('Xảy ra lỗi khi xóa!');
            }
        }
    }

    return (
        <>
            <form>
                {isEdit && <input type='hidden' name='id' value={id} />}
                <div>
                    <label>Tên</label>
                    <input type="text" name="name" value={name}
                        onBlur={(e) => handleBlur(e)}
                        onInput={(e) => handleInput(e)}
                        className={errorName && 'invalid'}
                        onChange={(e) => { setName(e.target.value) }}
                    />
                    <span style={{
                        color: 'red',
                        fontStyle: 'italic'
                    }}>{errorName}</span>
                </div>
                <br />
                <div>
                    <label>Địa chỉ</label>
                    <input type="text" name="address" value={address}
                        onBlur={(e) => handleBlur(e)}
                        onInput={(e) => handleInput(e)}
                        className={errorAddress && 'invalid'}
                        onChange={(e) => { setAddress(e.target.value) }}
                    />
                    <span style={{
                        color: 'red',
                        fontStyle: 'italic'
                    }}>{errorAddress}</span>
                </div>
                <div>
                    <button onClick={(e) => handleSubmit(e)}>{isEdit ? 'Sửa' : 'Thêm'}</button>
                </div>
            </form>
            <p style={{
                color: 'red',
                fontStyle: 'italic'
            }}>{error}</p>
            <ul>
                {listStudent.map((student) =>
                    <li key={student.id}>
                        <h2>Name: {student.name}</h2>
                        <p>Address: {student.address}</p>
                        <button onClick={() => handleClickEdit(student)}>Sửa</button>
                        <button onClick={() => handleDelete(student)}>Xóa</button>
                    </li>
                )}
            </ul>
        </>
    )
}

export default App;