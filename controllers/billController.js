const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const cartlist = req.body.cart.map((item) => {
        return {
          id: item.id,
          qty: item.qty,
          price: item.price_sell,
        };
      });
      const total = req.body.total;
      const payment = req.body.paymentMethod;
      const userId = req.body.user_id;
      const cash = req.body.cash;

      // add to bill
      const bill = await prisma.bill.create({
        data: {
          totalPrice: parseInt(total),
          user_id: parseInt(userId),
          cash: parseInt(cash),
        },
      });
      // add to bill_detail
      for (let i = 0; i < cartlist.length; i++) {
        const product = cartlist[i];
        await prisma.billDetail.create({
          data: {
            bill_id: parseInt(bill.id),
            product_id: parseInt(product.id),
            amount: parseInt(product.qty),
            price: parseInt(product.price),
          },
        });
      }

      // add to transaction
      await prisma.transaction.create({
        data: {
          tran_type: "income",
          paymentMethod: payment,
          detail: "ຂາຍສິນຄ້າລະຫັດບິນ: " + bill.id,
          user_id: parseInt(userId),
          totalPrice: parseInt(total),
        },
      });

    //   ອັບເດດສິນຄ້າ
        for (let i = 0; i < cartlist.length; i++) {
            const product = cartlist[i];
            await prisma.product.update({
            where: {
                id: parseInt(product.id),
            },
            data: {
                amount: {
                decrement: parseInt(product.qty),
                },
            },
            });
        }
      res.send({ message: "ສຳເລັດ", icon: "success", bill_id: bill.id });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },

  list: async (req, res) => {
    try {
      const billId = req.params.id;
      const bill = await prisma.bill.findFirst({
        where: {
          id: parseInt(billId),
        },
        include: {
          billDetail: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      res.send({ results: bill });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
