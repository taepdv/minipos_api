const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    create: async (req, res) => {
        try {
            if (req.body.name == '' || req.body.username == '' || req.body.password == '') {
                return res.send({ message: ' ບໍ່ມີຂໍ້ມູນທີ່ສົ່ງມາ ຫຼື ຂໍ້ມູນທີ່ສົ່ງມາບໍ່ທັນຄົບ...' })
            }
            //ກວດຂໍ້ມູນທີ່ມີ user ຊ້ຳກັນ
            const userExit = await prisma.user.findFirst({
                where: {
                    username: req.body.username
                }
            })
            if (userExit != undefined) {

                return res.send({ message: "ຊື່ຜູ້ໃຊ້ນີ້ມີໃນລະບົບແລ້ວ !!", icon: "error" })
            }
            await prisma.user.create({
                data: {
                    name: req.body.name,
                    username: req.body.username,
                    password: req.body.password
                }
            })
            res.send({ message: "ການລົງທະບຽນສຳເລັດ", icon: "success" })
        } catch (e) {
            res.status(500).send({ error: e.message })
        }
    },
    list: async (req, res) => {
        try {
            const Users = await prisma.user.findMany({
                orderBy: {
                    id: "desc"
                },
                where: {
                    status: "active"
                }
            })
            res.send({ results: Users })
        } catch (e) {
            res.status(500).send({ error: e.message })
        }
    },
    update: async (req, res) => {
        try {
            await prisma.user.update({
                where: {
                    id: parseInt(req.params.id),
                },
                data: {
                    name: req.body.name,
                    password: req.body.password,
                }
            });
            res.send({ message: "ແກ້ໄຂຂໍ້ມູນສຳເລັດ" });
        } catch (e) {
            res.status(500).send({ error: e.message });
        }
    },
    delete: async (req, res) => {
        try {
            await prisma.user.update({
                data: {
                    status: "inactive"
                },
                where: {
                    id: parseInt(req.params.id)
                }
            })
            res.send({ message: "ການລຶບຂໍ້ມູນສຳເລັດ" })
        } catch (e) {
            res.status(500).send({ error: e.message })
        }
    },
    Login: async (req, res) => {
        try {
            if(req.body.username == '' || req.body.password == ''){
                return res.send({ message: "ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ", icon: "error" })
            }
            const user = await prisma.user.findFirst({
                select: {
                    id: true,
                    username: true,
                },
                where: {
                    username: req.body.username,
                    password: req.body.password,
                    status: "active"
                }
            })
            if (user != undefined) {
               const secret = process.env.TOKEN_SECRET
               const token = jwt.sign({ username: user.username }, secret , { expiresIn: '30d' })
               res.send({ message: "ການເຂົ້າລະບົບສຳເລັດ", icon: "success", token: token, user_id: user.id })
            }else{
                return res.send({ message: "ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ", icon: "error" })
            }
          
        } catch (e) {
            res.status(500).send({ error: e.message })
        }
    }
};
