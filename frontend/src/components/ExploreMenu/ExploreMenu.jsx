import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({ category, setCategory }) => {
    return (
        <div className='explore-menu' id='explore-menu'>
            <h1>Explore The Menu</h1>
            <p className='explore-menu-text'>Discover a menu of delights, crafted with care to satisfy cravings and elevate every dining experience!</p>
            <div className="explore-menu-list">
                {
                    menu_list.map((item, idx) => {
                        return (
                            <div onClick={() => setCategory((pre) => pre === item.menu_name ? "All" : item.menu_name)} key={idx} className="explore-menu-list-item">
                                <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
                                <p>{item.menu_name}</p>
                            </div>
                        )
                    })
                }
            </div>
            <hr />
        </div>
    )
}

export default ExploreMenu
