<template>
  <div class="team-container">
    <div class="team-header">
      <h2 class="team-title">Đội ngũ chúng tôi</h2>
      <p class="team-description">
        Chúng tôi là đơn vị tiên phong trong lĩnh vực phát triển công nghệ, cung cấp các giải pháp
        sáng tạo và tối ưu hóa quy trình kinh doanh. Với đội ngũ chuyên gia giàu kinh nghiệm, chúng
        tôi không ngừng nghiên cứu và áp dụng công nghệ hiện đại để mang lại giá trị vượt trội cho
        khách hàng.
      </p>
    </div>

    <div class="team-gallery">
      <!-- Main Team Photo -->
      <div class="main-photo">
        <img :src="selectedImage" :alt="selectedImageAlt" />
      </div>

      <!-- Team Photos Grid -->
      <div class="photo-grid">
        <div class="grid-item" v-for="(image, index) in images" :key="index" @click="selectImage(image)">
          <img :src="image.src" :alt="image.alt" :class="{ 'active': selectedImage === image.src }" />
        </div>
      </div>
    </div>

    <div class="team-mission">
      <div class="img-mission">
        <img src="@/assets/sdtc-image/bgr.png" alt="Mission Image" />
      </div>
      <div class="mission-content"> 
      <h3>Sứ mệnh</h3>
      <p>
        Chúng tôi đem đến các giải pháp công nghệ toàn diện, nâng cao hiệu quả vận hành, tối ưu hóa
        chi phí, hỗ trợ doanh nghiệp chuyển đổi số và đồng hành cùng khách hàng trong hành trình
        phát triển bền vững. Hãy cùng chúng tôi kiến tạo tương lai số!
      </p> 
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComTeam',
  data() {
    return {
      selectedImage: require ('@/assets/sdtc-image/ve-chung-toi/image 13.png'),
      selectedImageAlt: 'Main Team Photo',
      originalImage: require ('@/assets/sdtc-image/ve-chung-toi/image 13.png'),
      originalImageAlt: 'Main Team Photo',
      resetTimer: null,
      images: [
        {
          src: require('@/assets/sdtc-image/ve-chung-toi/image 14.png'),
          alt: 'Team Photo 1'
        },
        {
          src: require('@/assets/sdtc-image/ve-chung-toi/image 11.png'),
          alt: 'Team Photo 2'
        },
        {
          src: require('@/assets/sdtc-image/ve-chung-toi/image 12.png'),
          alt: 'Team Photo 3'
        }
      ]
    }
  },
  methods: {
    selectImage(image) {
      // Xóa timer cũ nếu có
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
      }
      
      // Thay đổi ảnh hiển thị
      this.selectedImage = image.src;
      this.selectedImageAlt = image.alt;
      
      // Đặt timer để trở về ảnh ban đầu sau 5 giây
      this.resetTimer = setTimeout(() => {
        this.selectedImage = this.originalImage;
        this.selectedImageAlt = this.originalImageAlt;
      }, 3000);
    }
  }
}
</script>

<style scoped>
.team-container {
  width: 100%;
  margin: 0 auto;
  padding: 3rem 0;
  background-color: #F8F7FA;
}

.team-header {
  text-align: center;
  margin-bottom: 50px;
}

.team-title {
  color: #2196f3;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.team-description {
  color: #666;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.team-gallery {
  margin-bottom: 50px;
  padding: 0 120px;
}

.main-photo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.main-photo img {
  width: 100%;
  max-width: 1200px;
  height: auto;
  aspect-ratio: 16/9;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
}

.grid-item {
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  aspect-ratio: 16/9;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.grid-item img:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.grid-item img.active {
  border: 3px solid #2196f3;
}

.main-photo img {
  width: 500px;
  height: 324px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-radius: 8px;
}

/* Add smooth transition for main image change */
.main-photo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.main-photo img {
  transition: opacity 0.3s ease;
}

.main-photo img:hover {
  transform: scale(1.01);
}

.team-mission {
  text-align: center;
  padding: 1rem 0;
  margin-top: 50px;
  position: relative;
}

.img-mission {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.img-mission img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mission-content {
  position: relative;
  z-index: 2;
  padding: 3rem 1rem;
}

.mission-content h3 {
  color: #2196f3;
  font-size: 2em;
  margin-bottom: 20px;
}

.mission-content p {
  color: #666;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 1024px) {
  .team-gallery {
    padding: 0 60px;
  }
}

@media (max-width: 768px) {
  .team-gallery {
    padding: 0 20px;
  }
  
  .photo-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .grid-item {
    aspect-ratio: 16/9;
  }
}

.grid-item img {
  height: 200px;
}

</style>