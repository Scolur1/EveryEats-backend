import {Request, Response} from "express";
import Restaurant from "../models/restaurant";

const getRestaurant = async (req:Request, res: Response) => {
  try {
    //get restaurant id from req params
    const restaurantId = req.params.restaurantId;

    //attempt to find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if(!restaurant){
      return res.status(404).json({message: "restaurant not found"});
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "something went wrong"});
  }
};

const searchRestaurant = async (req:Request, res: Response) =>{
  try {
    //get city name from req param
    const city = req.params.city;
    //get any of the filtering sorting and page options available in req
    const searchQuery = (req.query.searchQuery as string) || "";
    //w/e we send array in request url, it appears in the BE as comma separated string.
    const selectedCuisines = req.query.selectedCuisines as string || "";
    //option we pass to mongoose query that specifies how we want results sorted
    const sortOption = req.query.sortOption as string || "lastUpdated";
    //depending on what page user is currently on in FE, w/e search req made, BE will use this page number to determine how many results to return
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    //check if there are any restaurants available in given city for this req
    query["city"] = new RegExp(city,"i");
    const cityCheck = await Restaurant.countDocuments(query);
    
    if(cityCheck === 0){
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });//return json object with same template for consistency
    }
    
    //handle cuisines filter
    if(selectedCuisines){
      //URL = selectedCuisines=italian,burgers,chinese
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
        //[italian, burgers, chinese]

      query["cuisines"] = {$all: cuisinesArray};
    }

    //handle the search query
    if(searchQuery){
      //restaurantName = Pizza Palace
      //cuisines = [Pizza, pasta, italian]
      //searchQuery = Pasta
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        {restaurantName: searchRegex},
        {cuisines: {$in: [searchRegex]} },
      ];
    }

    const pageSize = 10; //results client will see per page
    const skip = (page - 1) * pageSize; //how many results to skip to display req page

    //sortOption = "lastUpdated" then it will sort by that key
    //b/c its dynamic that is why we have to use the array syntax
    const restaurants = await Restaurant
      .find(query)
      .sort({[sortOption]:1})
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);//total pages

    const response = {
      data: restaurants,
      pagination: {
        total,
        page, //curr page
        pages: Math.ceil(total/pageSize), //50 results and pagesize 10 then 5 pages
      }
    }

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Something went wrong"});
  }
};

export default {
  getRestaurant,
  searchRestaurant
}