const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const db = mysql.createConnection({

    host: "localhost",
    password: "",
    user: "root",
    database: "moklet_rest_api"

})

db.connect(err => {
    if (err) console.log(err.message)
    else console.log("koneksi berhasil")
    })
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// GET: /pegawai --> end point untuk mengakses data pegawai
app.get("/pegawai", (req,res) => {
    let sql = "SELECT * FROM PEGAWAI"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        else{
            let response = {
                count: result.length,
                pegawai: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })

    
})

// POST: /pegawai --> end point untuk pencarian data pegawai
app.post("/pegawai", (req,res) => {
    let find = req.body.find
    let sql = "SELECT * FROM PEGAWAI WHERE ID_PEGAWAI LIKE '%"+find+"%' OR NAMA_PEGAWAI LIKE '%"+find+"%' OR ALAMAT LIKE '%"+find+"%'"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        } else {
            let response = {
                count: result.length,
                pegawai: result
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        }
    })
})
// POST: /pegawai/save --> end point untuk insert data pegawai
app.post("/pegawai/save", (req,res) => {
        let data = {
            id_pegawai: req.body.id_pegawai,
            nama_pegawai: req.body.nama_pegawai,
            alamat: req.body.alamat
        }
        let message = ""
    
        let sql = "INSERT INTO PEGAWAI SET ?"
        db.query(sql, data, (err,result) => {
            if (err) {
                message = err.message
            } else {
                message = result.affectedRows + " row inserted"
            }
    
            let response = {
                message : message
            }
        
            res.setHeader("Content-Type","application/json")
            res.send(JSON.stringify(response))
        })
    
        
    })
    
    // POST: /pegawai/update --> end point untuk update data pegawai
    app.post("/pegawai/update", (req,res) => {
        let data = [{
            id_pegawai: req.body.id_pegawai,
            nama_pegawai: req.body.nama_pegawai,
            alamat: req.body.alamat
        }, req.body.id_pegawai]
        let message = ""
    
        let sql = "UPDATE PEGAWAI SET ? WHERE ID_PEGAWAI = ?"
        db.query(sql, data, (err,result) => {
            if (err) {
                message = err.message
            } else {
                message = result.affectedRows + " row updated"
            }
    
            let response = {
                    message : message
                }
            
                res.setHeader("Content-Type","application/json")
                res.send(JSON.stringify(response))
            })
        
            
        })
        
        // DELETE: /pegawai/:nip --> end point untuk hapus data pegawai
        app.delete("/pegawai/:id_pegawai", (req,res) => {
            let data = {
                id_pegawai : req.params.id_pegawai
            }
            let message = ""
            let sql = "DELETE FROM PEGAWAI WHERE ?"
            db.query(sql, data, (err,result) => {
                if (err) {
                    message = err.message
                } else {
                    message = result.affectedRows + " row deleted"
                }
        
                let response = {
                    message : message
                }
            
                res.setHeader("Content-Type","application/json")
                res.send(JSON.stringify(response))
            })
        
            
        })
        
        app.listen(8000, () => {
            console.log("Server run on port 8000");
        })
