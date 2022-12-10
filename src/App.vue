<template>
  <div class="main__goods pb-5">
    <div class="pt-5 title has-text-centered">Купи батон 🥖</div>
    <form class="form" @submit.prevent="addGood">
      <div class="field is-grouped mb-5">
        <p class="control is-expanded">
          <input
            class="input is-large"
            type="text"
            placeholder="Название товара"
            v-model="goodContent"
          />
        </p>
        <p class="control">
          <button class="button is-info is-large" :disabled="!goodContent">
            🥖
          </button>
        </p>
      </div>
    </form>

    <div
      v-for="good in goods"
      class="card mb-3"
      :class="{ 'has-background-success-light': good.done }"
    >
      <div class="card-content">
        <div class="content">
          <div class="columns is-mobile is-vcentered">
            <div
              class="column has-text-centered is-size-3"
              :class="{ 'has-text-success line-through': good.done }"
              @click="toggleGood(good.id)"
            >
              {{ good.name }}
            </div>
            <div class="column is-5 has-text-right">
              <button
                class="button is-danger ml-2"
                @click="deleteGood(good.id)"
              >
                &cross;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="button is-danger is-size-4 mb-3 delall"
      @click="deleteAllGoods"
    >
      Удалить все
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { db } from './firebase/index';
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';

const goodsCollection = collection(db, 'goods');
const goodsCollectionQuery = query(goodsCollection, orderBy('date', 'desc'));
onMounted(() => {
  onSnapshot(goodsCollectionQuery, (querySnapshot) => {
    const fbGoods = [];
    querySnapshot.forEach((doc) => {
      const good = {
        id: doc.id,
        name: doc.data().name,
        done: doc.data().done,
      };
      fbGoods.push(good);
    });
    goods.value = fbGoods;
  });
});

const goods = ref([]);
const goodContent = ref('');

const addGood = () => {
  addDoc(goodsCollection, {
    name: goodContent.value,
    done: false,
    date: Date.now(),
  });
  goodContent.value = '';
};

const deleteGood = (id) => {
  deleteDoc(doc(goodsCollection, id));
};

const toggleGood = (id) => {
  const index = goods.value.findIndex((good) => good.id === id);
  updateDoc(doc(goodsCollection, id), {
    done: !goods.value[index].done,
  });
};

const deleteAllGoods = () => {
  const confirmDelete = confirm('Вы уверены что хотите удалить все товары?');
  if (confirmDelete) {
    goods.value.forEach((good) => {
      deleteGood(good.id);
    });
  }
};
</script>

<style>
@import 'bulma/css/bulma.min.css';

.main__goods {
  max-width: 350px;
  margin: auto;
}

.delall {
  width: 350px;
}

.line-through {
  text-decoration: line-through;
}
</style>
