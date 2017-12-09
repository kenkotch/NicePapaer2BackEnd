exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('schedule').del()
    .then(() => {
      // Inserts seed entries
      return knex('schedule').insert([{
        id: 1,
        time: "09:30",
        item: "test_event",
        description: "this event is a test",
        account_id: 1
      }, {
        id: 2,
        time: "10:30",
        item: "another event",
        description: "this event is a mean",
        account_id: 1
      }, {
        id: 3,
        time: "11:00",
        item: "mas event",
        description: "this event is a nice",
        account_id: 1
      }, {
        id: 4,
        time: "08:27",
        item: "breakfast event",
        description: "why are we awake?",
        account_id: 2
      }, {
        id: 5,
        time: "11:27",
        item: "brunch event",
        description: "No. Really. Why are we awake?",
        account_id: 2
      }, {
        id: 6,
        time: "12:00",
        item: "Escape",
        description: "Run into the nite",
        account_id: 3
      }, {
        id: 7,
        time: "08:00",
        item: "Escape",
        description: "This is not happening",
        account_id: 5
      }, {
        id: 8,
        time: "08:02",
        item: "Sorry",
        description: "Thanks for showing up.",
        account_id: 5
      }, {
        id: 9,
        time: "08:03",
        item: "Bad day",
        description: "Groom ran off. :(",
        account_id: 5
      }, {
        id: 10,
        time: "11:30",
        item: "Hair!",
        description: "I need a haircut.",
        account_id: 4
      }, {
        id: 11,
        time: "hide",
        item: "",
        description: "",
        account_id: 1
      }, {
        id: 12,
        time: "hide",
        item: "",
        description: "",
        account_id: 3
      }, {
        id: 13,
        time: "hide",
        item: "",
        description: "",
        account_id: 4
      }, {
        id: 14,
        time: "hide",
        item: "",
        description: "",
        account_id: 5
      }])
        .then(() => {
          return knex.raw("SELECT setval('schedule_id_seq',(SELECT MAX(id) FROM schedule));")
        })
    })
}
