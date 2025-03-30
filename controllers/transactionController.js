const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { DateTime } = require("luxon");

module.exports = {
  list: async (req, res) => {
    try {
        // Specify the Bangkok time zone
      const timeZone = "Asia/Bangkok";
      const myDate = DateTime.fromISO(req.body.dmy, { zone: timeZone });
      const y = myDate.year;
      const month = myDate.month;
      const d = myDate.toFormat('yyyy-MM-dd');
      const lastDay = DateTime.local(y, month, 1).endOf('month');    
      const lastDayFormat = lastDay.toFormat('yyyy-MM-dd')
      // console.log(lastDayFormat);

      // ໃຫ້ເປັນເລກຄູ່ສະເໝີ 01-99
      const m = String(month).padStart(2, '0')
      // console.log(`${m}`)
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.perpage) || 1000000;
      const sort = req.query.sort || "desc"
      const month_type = req.body.month_type;
      if (req.body.month_type == "y") {
        var results = await prisma.transaction.findMany({
          include: {
            user: true,
          },
          orderBy: {
            id: req.query.sort,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            date_add: {
              gte: new Date(`${y}-01-01`), // Start of the year
              lt: new Date(`${y + 1}-01-01`), // Start of the next year
            },
          },
        });
        var totalPosts = await prisma.transaction.count({
          orderBy: {
            id: req.query.sort,
          },
          where: {
            date_add: {
              gte: new Date(`${y}-01-01`), // Start of the year
              lt: new Date(`${y + 1}-01-01`), // Start of the next year
            },
          },
        }); // Get total number of posts
        var totalPages = Math.ceil(totalPosts / pageSize);
        const sumexp  = await prisma.transaction.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            tran_type: "expense",
            date_add: {
              gte: new Date(`${y}-01-01`), // Start of the year
              lt: new Date(`${y + 1}-01-01`), // Start of the next year
            },
          },
        });
        var total_exp = sumexp._sum.totalPrice
        const suminc  = await prisma.transaction.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            tran_type: "income",
            date_add: {
              gte: new Date(`${y}-01-01`), // Start of the year
              lt: new Date(`${y + 1}-01-01`), // Start of the next year
            },
          },
        });
        var total_inc= suminc._sum.totalPrice
      } else if (req.body.month_type == "m") {
        var results = await prisma.transaction.findMany({
          include: {
            user: true,
          },
          orderBy: {
            id: req.query.sort,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            date_add: {
              gte: new Date(`${y}-${m}-01`), // Start of the year
              lt: new Date(`${lastDayFormat}`), // Start of the next year
            },
          },
        });
        var totalPosts = await prisma.transaction.count({
          orderBy: {
            id: req.query.sort,
          },
          where: {
            date_add: {
              gte: new Date(`${y}-${m}-01`), // Start of the year
              lt: new Date(`${lastDayFormat}`), // Start of the next year
            },
          },
        }); // Get total number of posts
        var totalPages = Math.ceil(totalPosts / pageSize);
        const sumexp  = await prisma.transaction.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            tran_type: "expense",
            date_add: {
              gte: new Date(`${y}-${m}-01`), // Start of the year
              lt: new Date(`${lastDayFormat}`), // Start of the next year
            },
          },
        });
        var total_exp = sumexp._sum.totalPrice
        const suminc  = await prisma.transaction.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            tran_type: "income",
            date_add: {
              gte: new Date(`${y}-${m}-01`), // Start of the year
              lt: new Date(`${lastDayFormat}`), // Start of the next year
            },
          },
        });
        var total_inc= suminc._sum.totalPrice
      } else {
        var results = await prisma.transaction.findMany({
          include: {
            user: true,
          },
          orderBy: {
            id: req.query.sort,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            date_add: {
                gte: new Date(`${d} 00:00:00.000`), // Start of the year
                lt: new Date(`${d} 23:59:00.000`), // Start of the next year
              },
          },
        });
        var totalPosts = await prisma.transaction.count({
          orderBy: {
            id: req.query.sort,
          },
          where: {
            date_add: {
                gte: new Date(`${d} 00:00:00.000`), // Start of the year
                lt: new Date(`${d} 23:59:00.000`), // Start of the next year
              },
          },
        }); // Get total number of posts
        var totalPages = Math.ceil(totalPosts / pageSize);
        const sumexp  = await prisma.transaction.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            tran_type: "expense",
            date_add: {
                gte: new Date(`${d} 00:00:00.000`), // Start of the year
                lt: new Date(`${d} 23:59:00.000`), // Start of the next year
              },
          },
        });
        var total_exp = sumexp._sum.totalPrice
        const suminc  = await prisma.transaction.aggregate({
          _sum: {
            totalPrice: true,
          },
          where: {
            tran_type: "income",
            date_add: {
                gte: new Date(`${d} 00:00:00.000`), // Start of the year
                lt: new Date(`${d} 23:59:00.000`), // Start of the next year
              },
          },
        });
        var total_inc= suminc._sum.totalPrice
      }

      return res.send({
        results: results,
        currentPage: page,
        totalPages,
        totalPosts: totalPosts,
        sort: sort,
        total_exp: total_exp,
        total_inc: total_inc,
        dmy: d,
        month_type: month_type,
      });
      
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
