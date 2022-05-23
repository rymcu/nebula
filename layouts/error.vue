<template>
  <div class="error">
    <div class="error-content">
      <div>
        <el-image class="error-image" :src="image"></el-image>
        <div class="error-code">{{ error.statusCode }}</div>
      </div>
      <div class="error-wrapper-message">
        <h2 class="error-message">{{ error.message || notFound }}</h2>
      </div>
      <p class="error-link">
        <nuxt-link class="link" to="/">{{ backToHomePage }}</nuxt-link>
      </p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Error',
    layout: 'empty',
    props: {
      error: Object
    },
    computed: {
      image() {
        return this.images[Math.floor(Math.random()*5)];
      }
    },
    data() {
      return {
        notFound: '未找到你访问的界面',
        backToHomePage: '返回主页',
        images: [
          'https://static.rymcu.com/article/1597244306764.png',
          'https://static.rymcu.com/article/1597244962475.png',
          'https://static.rymcu.com/article/1597245053282.png',
          'https://static.rymcu.com/article/1597245075248.png',
          'https://static.rymcu.com/article/1597246071981.png'
        ]
      }
    }
  }
</script>

<style lang="less" scoped>
  @z-index-top: 99999;
  @white: #fff;

  @module-bg: var(rgba(@white, 0.6));

  @black-light: #555555;

  @transition-time-slow: .38s;

  .error {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
    z-index: @z-index-top;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: @white;

    @keyframes error-item {
      0% {
        opacity: 0;
        transform: translate3d(0, -30%, 0);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    > .error-content {
      > .error-code,
      > .error-link,
      > .error-wrapper-message {
        color: @black-light;
        animation: error-item ease-out both .6s @transition-time-slow;
        text-shadow: 5px 5px 5px #616161;
      }

      .link {
        &:hover {
          border-bottom: 1px solid;
        }
      }

      > .error-code {
        text-transform: uppercase;
        font-size: 10em;
        font-weight: normal;
        margin: 0;
      }

      > .error-wrapper-message {
        > .error-message {
          font-family: 'webfont-bolder', DINRegular;
          font-weight: normal;
          margin-top: 0;
          text-shadow: 5px 5px 5px #616161;
        }
      }
    }
  }

  .error-image {
    width: 28rem;
    animation: error-item ease-out both .6s @transition-time-slow;
  }

  .error-code {
    text-transform: uppercase;
    animation: error-item ease-out both .6s @transition-time-slow;
    color: #616161;
    font-size: 5em;
    text-shadow: 5px 5px 5px #616161;
  }

  .link {
    color: @black-light;
  }
</style>
