const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


module.exports = {
    create: async (req, res) => {
        try {
            if (req.body.name == '' || req.body.amount == '' || req.body.unit == '' || req.body.price_buy == '' || req.body.price_sell == '') {
                return res.send({ message: 'ບໍ່ມີຂໍ້ມູນທີ່ສົ່ງມາ ຫຼື ຂໍ້ມູນທີ່ສົ່ງມາບໍ່ທັນຄົບ...' })
            }

          if(!req.body.image){
            await prisma.product.create({
                data: {
                    name: req.body.name,
                    amount: parseInt(req.body.amount),
                    unit: req.body.unit,
                    price_buy: parseInt(req.body.price_buy),
                    price_sell: parseInt(req.body.price_sell),
                }
            })
          }else{
            await prisma.product.create({
                data: {
                    name: req.body.name,
                    amount: parseInt(req.body.amount),
                    unit: req.body.unit,
                    price_buy: parseInt(req.body.price_buy),
                    price_sell: parseInt(req.body.price_sell),
                    image: req.body.image
                }
            })
          }
      // add to transaction
      await prisma.transaction.create({
        data: {
          tran_type: "expense",
          paymentMethod: "ບໍ່ໄດ້ລະບຸ",
          detail: "ຊື້ສິນຄ້າ: " + req.body.name,
          user_id: parseInt(req.body.user_id),
          totalPrice: parseInt(req.body.price_buy) * parseInt(req.body.amount),
        },
      });
            res.send({ message: "ການເພີ່ມສິນຄ້າສຳເລັດ", icon: "success" })
        } catch (e) {
            res.status(500).send({ error: e.message })
        }
    },
    list: async (req, res) => {
        try {
            const products = await prisma.product.findMany({
                orderBy: {
                    id: "desc"
                },
                where: {
                    status: "active",
                    name: {
                        contains: req.query.search,
                      },
                }
            })
            res.send({ results: products })
        } catch (e) {
            res.status(500).send({ error: e.message })
        }
    },
    update: async (req, res) => {
        try {
           if(!req.body.image){
            await prisma.product.update({
                where: {
                    id: parseInt(req.params.id),
                },
                data: {
                    name: req.body.name,
                    amount: parseInt(req.body.amount),
                    unit: req.body.unit,
                    price_buy: parseInt(req.body.price_buy),
                    price_sell: parseInt(req.body.price_sell),
                }
            });
           }else{
            await prisma.product.update({
                where: {
                    id: parseInt(req.params.id),
                },
                data: {
                    name: req.body.name,
                    amount: parseInt(req.body.amount),
                    unit: req.body.unit,
                    price_buy: parseInt(req.body.price_buy),
                    price_sell: parseInt(req.body.price_sell),
                    image: req.body.image
                }
            });
           }
            res.send({ message: "ແກ້ໄຂຂໍ້ມູນສຳເລັດ", icon: "success" });
        } catch (e) {
            res.status(500).send({ error: e.message });
        }
    },
    delete: async (req, res) => {
        try {
            await prisma.product.update({
                data: {
                    status: "inactive"
                },
                where: {
                    id: parseInt(req.params.id)
                }
            })
            res.send({ message: "ການລຶບຂໍ້ມູນສຳເລັດ", icon: "success" })
        } catch (e) {
            res.status(500).send({ error: e.message })
        }
    },
};
