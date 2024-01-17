import { useEffect, useState } from 'react'
import FormInput from '../FormInput'
import { COLORS } from '../../styles/color'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loading from '../Loading'

const AddProduct = ({ setModal, setLoading }) => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState([])
  const [stock, setStock] = useState('')
  const [isFormValid, setIsFormValid] = useState(true)

  const navigate = useNavigate()

  const handleImageChange = (event) => {
    if (event.target.files.length > 0) {
      const newImages = Array.from(event.target.files)

      // Combine the newly selected images with the existing ones, limited to 4
      const combinedImages = [...images, ...newImages].slice(0, 4)

      // Update 'images' state with the limited number of images
      setImages(combinedImages)
    }
  }

  const removePhoto = (image) => {
    setImages([...images.filter((photo) => photo !== image)])
  }

  const selectAsMainPhoto = (image) => {
    setImages([image, ...images.filter((photo) => photo !== image)])
  }

  const addProduct = async (e) => {
    e.preventDefault()
    setLoading(true)
    setModal(false)

    try {
      const formData = new FormData()

      // Append 'images' to the formData
      images.forEach((img, index) => {
        formData.append(`images`, img)
      })

      // Append other form fields to the formData
      formData.append('name', name)
      formData.append('category', category)
      formData.append('brand', brand)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)

      const { data } = await axios.post('/admin/add-product', formData, {
        headers: { 'Content-type': 'multipart/form-data' },
      })

      if (data.success) {
        alert(`Product added successfully`)
        setLoading(false)
        navigate('/admin/products')
      } else {
        alert('failed to add product!')
        setLoading(false)
        navigate('/admin/products')
      }
    } catch (error) {
      console.error(error.response.data)
      alert('something went wrong!')
      navigate('/admin/products')
      setLoading(false)
    }
  }

  return (
    <div
      className=" p-3 fixed  top-16 bottom-0 left-0 right-0 flex justify-center text-white flex-col pb-10 z-10 items-center gap-5"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div className="border mt-8 my-auto md:my-0  rounded-lg overflow-y-auto  py-4 px-3  w-96 md:w-4/5 lg:w-3/5 items-center max-h-full min-h-[73vh] flex flex-col bg-white text-black pb-8 relative">
        <h1
          className="text-3xl font-bold mb-3"
          style={{ color: COLORS.BACKGROUND }}
        >
          Add Product
        </h1>
        <form
          onSubmit={addProduct}
          className="grid md:grid-cols-2 w-[80%] gap-x-10 mt-3"
        >
          <div>
            <FormInput
              label="Product Name"
              type="text"
              name="name"
              placeholder="Product Name"
              value={name}
              errorMessage="Username should be 3-50 characters and shouldn't include any special character!"
              pattern="^[A-Za-z0-9\s]{3,50}$"
              onchange={setName}
              isFormValid={isFormValid}
            />

            <label className="mt-3 ">Category</label>
            <select
              name="category"
              className="w-full border mt-1 border-slate-500 rounded-md h-10  text-sm font-semibold pl-2 "
              value={category}
              required
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option className="" value="smartphone">
                Smartphone
              </option>
              <option value="tab">Tab</option>
              <option value="smartwatch">Smartwatch</option>
              <option value="laptop">Laptop</option>
            </select>

            <FormInput
              label="Product Brand"
              type="text"
              name="brand"
              placeholder="Product's Brand name"
              errorMessage="enter a valid Brand name"
              value={brand}
              onchange={setBrand}
              pattern="^[A-Za-z\s]{3,20}$"
              isFormValid={isFormValid}
            />

            <label className="mt-3 mb-1">Description</label>
            <textarea
              required
              name="description"
              placeholder="Description of the product"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              pattern="^[a-zA-Z0-9\s]{1,1000}$"
              className="h-32 p-2 placeholder:font-semibold placeholder:text-gray-400" // You can adjust the height as needed
            />
          </div>

          {/* break point */}
          <div>
            <div className="flex flex-col overflow-x-auto">
              {images.length > 0 && (
                <div className="w-full h-24 flex justify-evenly gap-x-3 overflow-x-auto">
                  {images.length > 0 &&
                    images.map((img, i) => (
                      <div
                        key={i}
                        className=" max-h-full h-full w-16  relative "
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt="product image"
                          className="object-contain h-full w-full max-h-full max-w-full rounded-lg"
                        />

                        <button
                          onClick={(e) => removePhoto(img)}
                          className="absolute bottom-1 right-1 text-red-600 bg-black p-1 bg-opacity-50 rounded-2xl cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>

                        {/* make as main image */}
                        <button
                          onClick={(e) => selectAsMainPhoto(img)}
                          className="absolute top-1 right-1 text-white bg-black p-1 bg-opacity-50 rounded-2xl cursor-pointer"
                        >
                          {img === images[0] && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6  text-yellow-400"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {img !== images[0] && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                </div>
              )}

              <div className="flex items-center gap-x-2 mt-3 mb-1 ">
                <label className="">Product photo</label>
                <p className="text-xs my-auto  text-gray-400">{`(upto 4 images)`}</p>
              </div>
              <label className="h-32 flex cursor-pointer gap-1 items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/*"
                  disabled={images.length >= 4}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload
              </label>
            </div>

            <FormInput
              label="Price"
              type="number"
              name="price"
              placeholder="Product price in rupees"
              errorMessage="enter a valid price"
              value={price}
              onchange={setPrice}
              pattern="^[0-9]{1,6}$"
              isFormValid={isFormValid}
            />

            <FormInput
              label="Stock"
              type="number"
              name="stock"
              placeholder="Product stock count"
              errorMessage="enter a valid stock"
              value={stock}
              onchange={setStock}
              pattern="^[0-9]{1,6}$"
              isFormValid={isFormValid}
            />

            <button
              type="submit"
              className="w-full py-2 items-end  relative bottom-0 text-slate-300 mt-4 font-bold rounded-lg  text-sm bg-slate-800  hover:text-white hover:bg-slate-950"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
      <img
        onClick={() => setModal(false)}
        src="../../../assets/icons/modal-close.png"
        className="absolute cursor-pointer top-2 z-15 right-5 lg:right-20 rounded-full border border-slate-500 scale-105"
        alt="modal close png"
      />
    </div>
  )
}
export default AddProduct
