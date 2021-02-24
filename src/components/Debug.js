import {useState} from 'react'
import {Link} from 'react-router-dom'
import FileBase from 'react-file-base64';


const Debug = ({addBerry}) => {
    
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')

    const onSubmit = (e) => {
        e.preventDefault() //prevents from submitting to page

        if(!name){
            alert('Please add Berry Name')
            return
        }
        if(!image){
            alert('Please add Berry Image')
            return
        }
        if(!description){
            alert('Please add Berry Description')
            return
        }

        addBerry({name, image, description})

        setName('')
        setImage('')
        setDescription('')
    }
    return (
        <>
            <h1>DEBUG MENU</h1>
            <form  onSubmit={onSubmit}>
                <div className="form-control">
                    <label>Berry Name</label>
                    <input type="text" placeholder="Add Berry Name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-control">
                    <label>Berry Image</label>
                    <FileBase type="file" multiple={false} onDone={({ base64 }) => setImage(base64)} />                
                </div>
                <div className="form-control form-control-check">
                    <label>Berry Description</label>
                    <input type="text" placeholder="Add Berry Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <input type="submit" value="Add Berry" className="btn btn-block" />
            </form>
            <Link to='/'> Return</Link>
        </>
    )
}

export default Debug
