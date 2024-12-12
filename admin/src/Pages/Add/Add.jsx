import React, { useContext, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import { StoreContext } from '../../context/StoreContext'

const Add = () => {

    const {backendUrl} = useContext(StoreContext);

    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad",
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(pre => ({ ...pre, [name]: value }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description)
        formData.append("price", Number(data.price));
        formData.append("image", image);
        formData.append("category", data.category);

        const response = await axios.post(`${backendUrl}/api/food/add`, formData);
        if (response.data.success) {
            setData({
                name: "",
                description: "",
                price: "",
                category: "Salad"
            })
            setImage(false);
            toast.success("Food has been successfully added!!!")
        } else {
            console.log(response);
            toast.error("Sorry cannot add right now, Try Again Later!!!")
        }
    }

    return (
        <div className='add'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-image-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img className='materialU' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' name='image' hidden required />
                </div>
                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input className='materialU' onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type Here' />
                </div>
                <div className="add-product-description flex-col">
                    <p>Product Description</p>
                    <textarea className='materialU' onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write Content Here' required />
                </div>
                <div className="add-category-price">
                    <div className="add-category flex-xol">
                        <p>Product Category</p>
                        <select className='materialU' onChange={onChangeHandler} name="category">
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Deserts">Deserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                    <div className="add-price flex-col">
                        <p>Product Price</p>
                        <input className='materialU' onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder="20$" />
                    </div>
                </div>
                <button type='submit' className='add-btn materialU'>ADD</button>
            </form>
        </div>
    )
}

export default Add
