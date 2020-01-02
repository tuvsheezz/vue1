Vue.component('Person', {
  props: ['person', 'changeAge', 'printPerson'],
  filters: {
    fullname(person) {
      return `${person.first} ${person.last}`
    },
    ageInOneYear(age) {
      return age + 1
    }
  },
  template: `
    <div>
      <p>{{ person | fullname }}</p>
      <input v-model="person.first"/>
      <input v-model="person.last"/>
      <button v-on:click="printPerson(person)">PRINT</button>
      <p>
        <button v-on:click="changeAge(person, -1)">-</button>
        {{ person.age | ageInOneYear }}
        <button v-on:click="changeAge(person, 1)">+</button>
      </p>
    </div>
  `
})

const app = new Vue({
  el: "#app",
  data: {
    people: [
      {
        first: "Bobby",
        last: "Boone",
        age: 25
      },
      {
        first: "John",
        last: "Boone",
        age: 20
      }
    ],
    friends: [],
    newFriendName: "",
    editFriend: null
  },
  mounted() {
    this.getFriends()
  },
  methods: {
    changeAge(person, val) {
      person.age = person.age + val
    },
    printPerson(person) {
      console.log(JSON.stringify(person))
    },
    getFriends() {
      fetch("http://rest.learncode.academy/api/vue-5/friends")
        .then(res => res.json())
        .then((data) => {
          this.friends = data
        })
        .catch(err => {
          console.log("Error Reading data " + err)
        })
    },
    addNewFriend() {
      (async () => {
        await fetch("http://rest.learncode.academy/api/vue-5/friends", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name: this.newFriendName})
        })
          .then((res) => {
            res.json()
            this.getFriends()
            this.newFriendName = ""
          })
          .catch(err => {
            console.log("Error Reading data " + err)
          })
      })()
    },
    updateFriend(friend) {
      (async () => {
        await fetch("http://rest.learncode.academy/api/vue-5/friends/" + friend.id , {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(friend)
        })
          .then(() => {
            this.editFriend = null
            this.getFriends()
          })
          .catch(err => {
            console.log("Error Reading data " + err)
          })
      }) ()
    },
    deleteFriend(id) {
      (async () => {
        await fetch("http://rest.learncode.academy/api/vue-5/friends/" + id, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          this.getFriends()
        })
        .catch(err => {
          console.log("Error Reading data " + err)
        })
      }) ()
    }
  },
  template: `
    <div>
      <h2>SHITTY FETCH</h2>
      <input v-on:keyup.13="addNewFriend()" v-model="newFriendName" />
      <button v-on:click="addNewFriend()">ADD</button>
      <ul>
        <li v-for="friend in friends">
          <div v-if="editFriend === friend.id">
            <input v-on:keyup.13="updateFriend(friend)" v-model="friend.name" />
            <button v-on:click="updateFriend(friend)">UPDATE</button>
          </div>
          <div v-else>
            <button v-on:click="editFriend = friend.id">EDIT</button>
            <button v-on:click="deleteFriend(friend.id)">x</button>
            {{friend.name}}
          </div>
        </li>
      </ul>

      <h2>HI SHITTY VUE</h2>
      <Person
        v-for="person in people"
        v-bind:key="person.id"
        v-bind:person="person"
        v-bind:changeAge="changeAge"
        v-bind:printPerson="printPerson"
      />
    </div>
  `
})
