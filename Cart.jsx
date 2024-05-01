import React, { useEffect, useState } from 'react';
import './cart.css'

const Cart = () => {
    const [cardColumns, setCardColumns] = useState(() => {
        const savedCol = localStorage.getItem('cardColumns');
        return savedCol
            ? JSON.parse(savedCol)
            : {
                //three cardColumns list ,each column contain multiple cards
                column1: [
                    { id: 1, title: 'Card 1', description: 'Description  1' },
                    { id: 2, title: 'Card 2', description: 'Description  2' }
                ],
                column2: [
                    { id: 3, title: 'Card 3', description: 'Description  3' },
                    { id: 4, title: 'Card 4', description: 'Description  4' }
                ],
                column3: [
                    { id: 5, title: 'Card 5', description: 'Description  5' },
                    { id: 6, title: 'Card 6', description: 'Description  6' }
                ],


            };
    });

    const [displayModel, setdisplayModel] = useState(false);
    const [newCardInfo, setNewCardInfo] = useState({ title: '', description: '', column: 'column1' });
    const [formErrors, setFormErrors] = useState({ title: '', description: '' });
    useEffect(() => {
        const cardCol = localStorage.getItem('cardColumns');
        if (cardCol) {
            setCardColumns(JSON.parse(cardCol));
        }
    }, []);



    //The state should be maintained after refresh.
    useEffect(() => {
        localStorage.setItem('cardColumns', JSON.stringify(cardColumns))
    }, [cardColumns]);

    // Function to save the current state to localStorage
    const saveState = () => {
        localStorage.setItem('cardColumns', JSON.stringify(cardColumns));
    };

    //for adding the cart 
    const handleAddNewCard = (column) => {
        const newCard = {
            id: Date.now(),
            title: 'New Card',
            description: 'Description for the card ',
        };

        setCardColumns((prevColumns) => {
            const columnCards = Array.isArray(prevColumns[column]) ? prevColumns[column] : [];
            return {
                ...prevColumns,
                [column]: [...columnCards, newCard]
            }
        });
        saveState()
    }

    //move a card from one column to another by drag and drop.

    const handleDragStart = (e, cardId, columnId) => {
        e.dataTransfer.setData('cardId', cardId);
        e.dataTransfer.setData('columnId', columnId);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetColumn) => {
        const cardId = e.dataTransfer.getData('cardId');
        const sourceCol = e.dataTransfer.getData('columnId');
        const updatedCol = { ...cardColumns };

        const sourceCards = updatedCol[sourceCol].filter((card) => card.id !== parseInt(cardId));
        const [movedCard] = updatedCol[sourceCol].filter((card) => card.id === parseInt(cardId));

        updatedCol[sourceCol] = sourceCards;
        updatedCol[targetColumn] = [...updatedCol[targetColumn], movedCard];

        setCardColumns(updatedCol);
        saveState();
    }


    // Function to handle removing a card from a column
    const handleRemove = (column, cardId) => {
        setCardColumns(prevColumns => {
            const newCol = { ...prevColumns };
            newCol[column] = newCol[column].filter(card => card.id !== cardId);
            return newCol;
        });
        saveState();
    };

    // Function to handle opening the add card modal with prefilled data
    // const handleAddNewCardPopUp = (column, cardData) => {
    //     if (cardData && cardData.title) {
    //         setNewCardInfo({
    //             title: cardData.title,
    //             description: cardData.description,
    //             column: column,
    //         });
    //         setdisplayModel(true);
    //     } else {
    //         console.error("Invalid card data:", cardData);
    //     }
    // };

    // Function to handle opening the add card modal with prefilled data
    const handleAddNewCardPopUp = (column) => {
        if (column) {
            setNewCardInfo({
                title: column.title,
                description: column.description,
                column: column,
            });
            setdisplayModel(true);
        } else {
            console.error("Invalid card data:", column);
        }
    };

    const handleCloseModel = () => {
        setdisplayModel(false);
        setNewCardInfo({ title: '', description: '', column: 'column1' });
        setFormErrors({ title: '', description: '' });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newCard = {
                id: Date.now(),
                title: newCardInfo.title,
                description: newCardInfo.description,
            };
            setCardColumns((prevColumns) => ({
                ...prevColumns,
                [newCardInfo.column]: [...prevColumns[newCardInfo.column], newCard],
            }))
            
            // if (newCardInfo.id) {
            //     const updatedCards = cardColumns[newCardInfo.column].filter(card => card.id !== newCardInfo.id);
            //     setCardColumns((prevColumns) => ({
            //         ...prevColumns,
            //         [newCardInfo.column]: [...updatedCards, newCard],
            //     }));
            // } else {
            //     setCardColumns((prevColumns) => ({
            //         ...prevColumns,
            //         [newCardInfo.column]: [...prevColumns[newCardInfo.column], newCard],
            //     }));
            // }


            setdisplayModel(false)
            setNewCardInfo({ title: '', description: '', column: '' });
            setFormErrors({ title: '', description: '' });
            saveState();
        }
    }

    //validate from data
    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!newCardInfo.title.match(/^[a-zA-Z\s]*$/)) {
            errors.title = 'Title should only contain alphabets';
            isValid = false;
        }
        if (!(newCardInfo.description.length >= 25)) {
            errors.description = 'Description should be at least 25 characters long';
            isValid = false;
        }
        setFormErrors(errors);
        return isValid;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCardInfo((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

      

    return (

        <div className='container mt-5'>             
         <button onClick={()=>handleAddNewCardPopUp(newCardInfo.column)} className='btn btn-primary mb-3'>Add New Card</button>

            {/* {Object.keys(cardColumns).map((column) => (
                <button
                    key={column}
                    onClick={() => handleAddNewCardPopUp(column)} // Pass the column ID dynamically
                    className="btn btn-primary mb-3"
                >
                 Add New Card to {column}
                 </button>
            ))} */}
            {displayModel && (
                <div className='model' onClick={handleCloseModel}>
                    <div className='model-content' onClick={(e) => e.stopPropagation()}>
                        <span className='close' onClick={handleCloseModel}>&times;</span>
                        {/* form part */}
                        <form onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label>Title:</label>
                                <input
                                    type="text"
                                    name='title'
                                    value={newCardInfo.title}
                                    onChange={handleInputChange}
                                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                                    required
                                />
                                {formErrors.title && <div className='invalid-feedback'>{formErrors.title}</div>}
                            </div>
                            <div className='form-group'>
                                <label>Description:</label>
                                <textarea
                                    name='description'
                                    value={newCardInfo.description}
                                    onChange={handleInputChange}
                                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                                    required

                                />
                                {formErrors.description && <div className='invalid-feedback'>{formErrors.description}</div>}
                            </div>
                            <div className='form-group'>
                                <label>column:</label>
                                <select
                                    name='column'
                                    value={newCardInfo.column}
                                    onChange={handleInputChange}
                                    className='form-control'
                                    required>
                                    {Object.keys(cardColumns).map((columnId) => (
                                        <option key={columnId} value={columnId}>{columnId}</option>
                                    ))}
                                </select>
                            </div>
                            <button type='submit' className='btn btn-primary'>save</button>
                        </form>
                    </div>
                </div>
            )}

            {/* column part */}
            <div className='row' style={{ display: 'flex' }}>
                {Object.keys(cardColumns).map((columnId, index) => (
                    <div key={index} className='col' onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, columnId)}>
                        <h2>{columnId}</h2>

                        <div className='list-group'>
                            {cardColumns[columnId].map((card) => (
                                <div key={card.id} className='list-group-item' draggable onDragStart={(e) => handleDragStart(e, card.id, columnId)}>
                                    <h5 className='mb-1' onClick={() => handleAddNewCardPopUp(columnId, card)}>{card.title}</h5>
                                    <p className='mb-1' onClick={() => handleAddNewCardPopUp(columnId, card)}>{card.description}</p>
                                    <button className="btn2" onClick={() => handleRemove(columnId, card.id)}>Remove</button>
                                </div>
                            ))}

                        </div>
                    </div>
                ))}
            </div>
        </div>

    );

}
// import React, { useEffect, useState } from 'react';
// import './cart.css';

// const Cart = () => {
//     const [cardColumns, setCardColumns] = useState(() => {
//         const savedCol = localStorage.getItem('cardColumns');
//         return savedCol
//             ? JSON.parse(savedCol)
//             : {
//                 column1: [
//                     { id: 1, title: 'Card 1', description: 'Description 1' },
//                     { id: 2, title: 'Card 2', description: 'Description 2' }
//                 ],
//                 column2: [
//                     { id: 3, title: 'Card 3', description: 'Description 3' },
//                     { id: 4, title: 'Card 4', description: 'Description 4' }
//                 ],
//                 column3: [
//                     { id: 5, title: 'Card 5', description: 'Description 5' },
//                     { id: 6, title: 'Card 6', description: 'Description 6' }
//                 ]
//             };
//     });

//     const [displayModel, setDisplayModel] = useState(false);
//     const [newCardInfo, setNewCardInfo] = useState({ title: '', description: '', column: 'column1' });
//     const [formErrors, setFormErrors] = useState({ title: '', description: '' });

//     useEffect(() => {
//         const cardCol = localStorage.getItem('cardColumns');
//         if (cardCol) {
//             setCardColumns(JSON.parse(cardCol));
//         }
//     }, []);

//     useEffect(() => {
//         localStorage.setItem('cardColumns', JSON.stringify(cardColumns));
//     }, [cardColumns]);

//     const saveState = () => {
//         localStorage.setItem('cardColumns', JSON.stringify(cardColumns));
//     };

//     const handleAddNewCard = (column) => {
//         console.log('RRR Add New Card');
//         const newCard = {
//             id: Date.now(),
//             title: 'New Card',
//             description: 'Description for the card',
//         };

//         setCardColumns((prevColumns) => ({
//             ...prevColumns,
//             [column]: [...prevColumns[column], newCard]
//         }));
//         saveState();
//     };

//     const handleDragStart = (e, cardId, columnId) => {
//         e.dataTransfer.setData('cardId', cardId);
//         e.dataTransfer.setData('columnId', columnId);
//     };

//     const handleDragOver = (e) => {
//         e.preventDefault();
//     };

//     const handleDrop = (e, targetColumn) => {
//         const cardId = e.dataTransfer.getData('cardId');
//         const sourceCol = e.dataTransfer.getData('columnId');
//         const updatedCol = { ...cardColumns };

//         const sourceCards = updatedCol[sourceCol].filter((card) => card.id !== parseInt(cardId));
//         const [movedCard] = updatedCol[sourceCol].filter((card) => card.id === parseInt(cardId));

//         updatedCol[sourceCol] = sourceCards;
//         updatedCol[targetColumn] = [...updatedCol[targetColumn], movedCard];

//         setCardColumns(updatedCol);
//         saveState();
//     };

    // handleAddNewCard =()=>{
    //     setDisplayModel(true);
    // };

//     const handleRemove = (column, cardId) => {
//         setCardColumns((prevColumns) => ({
//             ...prevColumns,
//             [column]: prevColumns[column].filter((card) => card.id !== cardId)
//         }));
//         saveState();
//     };

//     const handleAddNewCardPopUp = (column, cardData) => {
//         console.log("cardData:"+cardData);
//         if (cardData && cardData.title) {
//             setNewCardInfo({
//                 title: cardData.title,
//                 description: cardData.description,
//                 column: column,
//             });
//             setDisplayModel(true);
//         } else {
//             console.error("Invalid card data:", cardData);
//         }
//     };

//     const handleCloseModel = () => {
//         setDisplayModel(false);
//         setNewCardInfo({ title: '', description: '', column: 'column1' });
//         setFormErrors({ title: '', description: '' });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//             const newCard = {
//                 id: Date.now(),
//                 title: newCardInfo.title,
//                 description: newCardInfo.description,
//             };
//             setCardColumns((prevColumns) => ({
//                 ...prevColumns,
//                 [newCardInfo.column]: [...prevColumns[newCardInfo.column], newCard],
//             }));
//             setDisplayModel(false);
//             setNewCardInfo({ title: '', description: '', column: 'column1' });
//             setFormErrors({ title: '', description: '' });
//             saveState();
//         }
//     };

//     const validateForm = () => {
//         let errors = {};
//         let isValid = true;

//         if (!newCardInfo.title.match(/^[a-zA-Z\s]*$/)) {
//             errors.title = 'Title should only contain alphabets';
//             isValid = false;
//         }
//         if (!(newCardInfo.description.length >= 25)) {
//             errors.description = 'Description should be at least 25 characters long';
//             isValid = false;
//         }
//         setFormErrors(errors);
//         return isValid;
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setNewCardInfo((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };

//     return (
//         <div className='container mt-5'>
//             <button onClick={() => handleAddNewCardPopUp('column1',)} className='btn btn-primary mb-3'>Add New Card</button>

//             {displayModel && (
//                 <div className='model' onClick={handleCloseModel}>
//                     <div className='model-content' onClick={(e) => e.stopPropagation()}>
//                         <span className='close' onClick={handleCloseModel}>&times;</span>
//                         <form onSubmit={handleSubmit}>
//                             <div className='form-group'>
//                                 <label>Title:</label>
//                                 <input
//                                     type="text"
//                                     name='title'
//                                     value={newCardInfo.title}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
//                                     required
//                                 />
//                                 {formErrors.title && <div className='invalid-feedback'>{formErrors.title}</div>}
//                             </div>
//                             <div className='form-group'>
//                                 <label>Description:</label>
//                                 <textarea
//                                     name='description'
//                                     value={newCardInfo.description}
//                                     onChange={handleInputChange}
//                                     className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
//                                     required
//                                 />
//                                 {formErrors.description && <div className='invalid-feedback'>{formErrors.description}</div>}
//                             </div>
//                             <div className='form-group'>
//                                 <label>Column:</label>
//                                 <select
//                                     name='column'
//                                     value={newCardInfo.column}
//                                     onChange={handleInputChange}
//                                     className='form-control'
//                                     required>
//                                     {Object.keys(cardColumns).map((columnId) => (
//                                         <option key={columnId} value={columnId}>{columnId}</option>
//                                     ))}
//                                 </select>
//                             </div>
//                             <button type='submit' className='btn btn-primary'>Save</button>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             <div className='row' style={{ display: 'flex' }}>
//                 {Object.keys(cardColumns).map((columnId, index) => (
//                     <div key={index} className='col' onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, columnId)}>
//                         <h2>{columnId}</h2>
//                         <div className='list-group'>
//                             {cardColumns[columnId].map((card) => (
//                                 <div key={card.id} className='list-group-item' draggable onDragStart={(e) => handleDragStart(e, card.id, columnId)}>
//                                     <>
//                                         <h5 className='mb-1' onClick={() => handleAddNewCardPopUp(columnId, card)}>{card.title}</h5>
//                                         <p className='mb-1' onClick={() => handleAddNewCardPopUp(columnId, card)}>{card.description}</p>
//                                     </>
//                                     <button className="btn btn-danger" onClick={() => handleRemove(columnId, card.id)}>Remove</button>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

export default Cart;



