const { Activity } = require('../models')

if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const axios = require('axios')

class Controller {
    static async getActivity (req, res, next) {
        try {
            let user = req.user
            const find = await Activity.findAll({where: {UserId: user.id}})
            res.status(200).json(find)
        } catch (err) {
            next (err)
        }
    }

    static async createActivity (req, res, next) {
        try {
            const data = {
                judul: req.body.judul,
                deskripsi: req.body.deskripsi,
                alokasiWaktu: req.body.alokasiWaktu,
                status: 'pending',
                UserId: req.user.id
            }
            const create = await Activity.create(data)
            res.status(201).json(create)
        } catch (err) {
            next (err)
        }
    }

    static async getActivityById (req, res, next) {
        try {
            let id = req.params.id
            const find = await Activity.findByPk(id)
            res.status(200).json(find)
        } catch (err) {
            next (err)
        }
    }

    static async changeStatus (req, res, next) {
        try {
            let data
            let id = req.params.id
            let find = await Activity.findByPk(id)
            if(!find){
                throw {
                    status: 404,
                    message: "Data not found"
                }
            } else {
                if(find.status == 'pending'){
                    data = {
                        status: 'finish'
                    }
                } else {
                    data = {
                        status: 'pending'
                    }
                }
                const edit = await Activity.update(data, {where: {id}, returning: true})
                res.status(200).json(edit[1][0])
            }
        } catch (err) {
            next(err)
        }
    }

    static async deleteActivity (req, res, next) {
        try {
            let id = req.params.id
            const find = Activity.findByPk(id)
            if(!find){
                throw {
                    status: 404,
                    message: "Data not found"
                }
            } else {
                const deleted = await Activity.destroy({where: {id}})
                res.status(200).json("Activity deleted")
            }
        } catch (err) {
            next (err)
        }
    }

    static async editActivityById (req, res, next) {
        try {
            let id = req.params.id
            const data = {
                judul: req.body.judul,
                deskripsi: req.body.deskripsi,
                alokasiWaktu: req.body.alokasiWaktu,
                status: 'pending',
                UserId: req.user.id
            }
            const edit = await Activity.update(data, {where: {id}, returning: true})
            res.status(200).json(edit[1][0])
        } catch (err) {
            next (err)
        }
    }

    static async getWeather(req, res, next) {
        const weatherLink = 'https://www.metaweather.com/api/location/1047378/'

        axios.get(weatherLink)
        .then(data => {
            res.status(200).json(data.data.consolidated_weather)
        })
        .catch(err => {
            console.log(err.message);
        })
    }

    static cnnNews(req, res, next) {
        const breakingNews = 'https://www.news.developeridn.com/'

        let getNews = []

        axios.get(breakingNews)
        .then(response => {
            if(response) {
                for(let i = 0 ; i < 10; i++) {
                    getNews.push(response.data.data[i])
                }
                res.status(200).json(getNews)
            } else {
                throw {
                    status : 401,
                    message : 'bad request'
                }
            } 
        })
        .catch(err => {
            next(err)
        })
    }

    static covidUpdate(req, res, next) {
        
        const dataCovid = 'https://data.covid19.go.id/public/api/update.json'

        const getData = []

        axios.get(dataCovid)
        .then(response => {
            if(response) {
                getData.push({
                    dataCovid : response.data.data,
                    updateCovid : response.data.update.penambahan
                })

                res.status(200).json(getData)
            } else {
                throw {
                    status: 401,
                    message: "bad Request"
                }
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static movieList(req, res, next) {
        let query = req.body.searchMovie

        let moviePopular

        if(!query) {
            moviePopular = `http://www.omdbapi.com/?apikey=${process.env.SECRET_OMDB_KEY}&t=spiderman`
        } else {
            moviePopular = `http://www.omdbapi.com/?apikey=${process.env.SECRET_OMDB_KEY}&t=${query}`
        } 

             
        axios.get(moviePopular)
        .then(data => {
            if(data) {
                res.status(200).json(data)
            } else {
                throw {
                    status : 401,
                    message : 'Bad request'
                }
            }
        })
        .catch(err => {
            next(err)
        })
    }

    static musicList(req, res, next) {
        let query = ''

        const musicPlay = ''

        axios.get(musicPlay)
        .then(data => {
            if(data) {
                res.status(200).json(data)
            } else {
                throw {
                    status : 401,
                    message : 'Bad request'
                }
            }
        })
        .catch(err => {
            next(err)
        })
    }
}

module.exports = Controller