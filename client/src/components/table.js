import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

const Tablee = ({ filterNames }) => {
return(
        filterNames.map((student, key) => {
            return (
                <Container>
                <Table striped bordered hover >
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Skill1</th>
                    <th>Skill2</th>
                    <th>Skill3</th>
                    <th>Status</th>
                    <th>Availability</th>
                </tr>
            </thead>
                
                        <tbody >

                            <td>{student.fullName}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                            <td>{student.skill1}</td>
                            <td>{student.skill2}</td>
                            <td>{student.skill3}</td>
                            <td>{student.status}</td>
                            <td>{student.availability}</td>
                        </tbody>
               
        </Table>
        </Container>
            )}
        ))}    

export default Tablee;