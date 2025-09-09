import pool from "../config/db.js";

export const createRestaurant = async (req, res) => {
    try{
        const { name, address, lat, lng } = req.body;
        const ownerUserId = req.user.id;

        const result = await pool.query(
            'INSERT INTO restaurant.restaurants (owner_user_id, name, address, lat, lng) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, address, lat, lng, is_open, created_at', [ownerUserId, name, address, lat, lng]
        );

        res.status(201).json({message: "Restaurant created", restaurant: result.rows[0]});

    } catch(err){
        console.error("CreateRestaurant error : ", err.message);
        res.status(500).json({message: "Server error"});
    }
};

export const getRestaurants = async ( req, res )=>{
    try{
        const result = await pool.query(
            'SELECT id, name, address, lat, lng, is_open, created_at FROM restaurant.restaurants'
        );
        res.json(result.rows);
    } catch (err){
        console.error("GetRestaurants error: ", err.message);
        res.status(500).json({message: "Server error"});
    }
};

export const getRestaurantById = async ( req, res ) => {
    try{
        const { id } = req.params;
        const restaurantResult = await pool.query(
            'SELECT id, name, address, lat, lng, is_open, created_at FROM restaurant.restaurants WHERE id=$1', [id]
        );

        if(restaurantResult.rows.length === 0){
            return res.status(404).json({message: "Restaurant not found"});
        }

        const menuResult = await pool.query(
            'SELECT id, name, description, price_cents, is_available, created_at FROM restaurant.menu_items WHERE restaurant_id=$1', [id]
        );

        res.json({ ...restaurantResult.rows[0], menu: menuResult.rows});
    }
    catch(err){
        console.error("GetRestaurantById error: ", err.message);
        res.status(500).json({message: "Server error"});
    }
};