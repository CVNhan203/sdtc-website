<template>
  <div class="procedure-container">
    <h2 class="main-title">
      Quy trình xây dựng website <br />
      chuyên nghiệp và hiệu quả
    </h2>

    <div class="procedure-steps">
      <!-- Step 1 -->
      <div class="step-item">
        <div class="step-icon">
          <img src="@/assets/sdtc-image/quy-trinh/data-analysis.png" alt="Phân tích nhu cầu" />
        </div>
        <div class="step-content">
          <h3>Phân tích nhu cầu</h3>
          <p>
            Chúng tôi bắt đầu bằng việc nghiên cứu kỹ lưỡng các yêu cầu, mục tiêu và thách thức cụ
            thể mà bạn đang gặp phải. Bằng cách lắng nghe ý kiến và tìm hiểu sâu về lĩnh vực của
            bạn, chúng tôi đảm bảo mọi giải pháp đề xuất đều xuất phát từ nhu cầu thực tế. Điều này
            không chỉ giúp xây dựng một chiến lược phù hợp mà còn mang lại sự tối ưu hóa trong từng
            giai đoạn phát triển. Với quy trình phân tích rõ ràng, chúng tôi cam kết sẽ đồng hành
            cùng bạn từ bước đầu tiên để hướng đến kết quả vượt mong đợi.
          </p>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="step-item">
        <div class="step-icon">
          <img
            src="@/assets/sdtc-image/quy-trinh/software-engineer 1.png"
            alt="Phát triển thiết kế"
          />
        </div>
        <div class="step-content">
          <h3>Phát triển thiết kế</h3>
          <p>
            Giai đoạn phát triển thiết kế tập trung vào việc hiện thực hóa các ý tưởng sáng tạo, kết
            hợp giữa thẩm mỹ và chức năng để tạo ra những giải pháp hoàn hảo. Đội ngũ của chúng tôi
            không chỉ chú trọng vào việc xây dựng giao diện đẹp mắt mà còn đảm bảo sự thân thiện với
            người dùng, giúp họ có trải nghiệm trực quan và dễ dàng nhất. Các thiết kế của chúng tôi
            không chỉ đơn thuần là hình ảnh mà còn mang đến giá trị sử dụng thực tế, phù hợp với xu
            hướng hiện đại và nhu cầu của thị trường.
          </p>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="step-item">
        <div class="step-icon">
          <img src="@/assets/sdtc-image/quy-trinh/typing 1.png" alt="Triển khai giải pháp" />
        </div>
        <div class="step-content">
          <h3>Triển khai giải pháp</h3>
          <p>
            Trong giai đoạn triển khai, chúng tôi tập trung vào việc chuyển đổi các ý tưởng và thiết
            kế thành những sản phẩm thực tế, đáp ứng đầy đủ các yêu cầu kỹ thuật và chiến lược đã
            thống nhất. Quy trình triển khai được tối ưu hóa để đảm bảo tiến độ nhanh chóng, hiệu
            quả cao và không phát sinh rủi ro không cần thiết. Chúng tôi sử dụng công nghệ hiện đại
            cùng phương pháp quản lý dự án chặt chẽ để đưa sản phẩm của bạn ra thị trường một cách
            suôn sẻ, vượt trên sự kỳ vọng.
          </p>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="step-item">
        <div class="step-icon">
          <img
            src="@/assets/sdtc-image/quy-trinh/responsive-design 1.png"
            alt="Đánh giá và tối ưu hóa"
          />
        </div>
        <div class="step-content">
          <h3>Đánh giá và tối ưu hóa</h3>
          <p>
            Sau khi triển khai, chúng tôi không dừng lại ở việc bàn giao sản phẩm mà tiếp tục đồng
            hành cùng bạn trong giai đoạn đánh giá và tối ưu hóa. Dựa trên các dữ liệu thu thập thực
            tế, chúng tôi tiến hành đo lường hiệu quả, phát hiện các vấn đề cần cải thiện và đề xuất
            các điều chỉnh kịp thời. Quy trình tối ưu hóa này giúp bạn không ngừng cải thiện chất
            lượng sản phẩm hoặc dịch vụ, giữ vững vị trí cạnh tranh trên thị trường và mang lại giá
            trị lâu dài cho doanh nghiệp của bạn.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComProcedure',
  data() {
    return {
      // Data properties if needed
    }
  },
}
</script>

<style scoped>
.procedure-container {
  width: 100%;
  margin: 0 auto;
  padding: 2rem 10rem;
  background-color: #F8F7FA;
}

.main-title {
  text-align: center;
  color: #2196f3;
  margin-bottom: 40px;
  font-size: 2em;
}

.procedure-steps {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.step-item {
  display: flex;
  align-items: flex-start;
  background:#DCF0FF;
  padding: 20px;
  border-radius: 2rem;
}

.step-icon {
  flex-shrink: 0;
  width: 100px;
  height: 100px;
  margin-right: 20px;
}

.step-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.5em;
}

.step-content p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .step-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .step-icon {
    margin: 0 0 20px 0;
  }
}
</style>
