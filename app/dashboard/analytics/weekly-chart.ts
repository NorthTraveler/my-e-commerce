import checkDate from "./check-date"

export const weeklyChart = (chartItems: { date: Date; revenue: number }[]) => {
  return [
    {
      date: "6天前",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 6))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "5天前",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 5))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "4天前",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 4))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "3天前",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 3))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "2天前",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 2))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "1天前",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 1))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
    {
      date: "today",
      revenue: chartItems
        .filter((order) => checkDate(order.date, 0))
        .reduce((acc, price) => acc + price.revenue, 0),
    },
  ]
}
