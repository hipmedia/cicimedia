async function downloadContent() {
      const url = document.getElementById('urlInput').value;
      const format = document.querySelector('input[name="format"]:checked').value;
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = ''; 

      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      const videoId = match ? match[1] : null;

      if (!videoId) {
        resultDiv.innerHTML = '<div class="alert alert-warning border-0"><i class="bi bi-exclamation-triangle-fill me-2"></i>Link YouTube không hợp lệ.</div>';
        return;
      }

      resultDiv.innerHTML = `
        <div class="text-center">
          <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
          <p class="mt-2">Đang xử lý, vui lòng chờ...</p>
        </div>
      `;
      
      if (format === 'mp3') {
        await downloadMp3(videoId, resultDiv);
      } else {
        await downloadMp4(videoId, resultDiv);
      }
    }

    async function downloadMp3(videoId, resultDiv) {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'f6580fc793msh8abe2cea14e27cfp1ae092jsna25f56184781', // Thay thế bằng key của bạn
          'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com'
        }
      };
      try {
        const response = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, options);
        const data = await response.json();
        if (data.status === 'ok') {
          resultDiv.innerHTML = `
            <h5 class="text-white mb-2"><i class="bi bi-check-circle-fill me-2" style="color: var(--star-yellow);"></i> MP3 Sẵn Sàng!</h5>
            <p class="mb-3 text-white-50 small">${data.title}</p>
            <a href="${data.link}" target="_blank" class="btn btn-sm btn-outline-light"><i class="bi bi-download me-2"></i> Tải Về Tệp MP3</a>
          `;
        } else {
          resultDiv.innerHTML = `<div class="alert alert-danger border-0"><i class="bi bi-x-circle-fill me-2"></i> Thất bại. ${data.msg || 'Lỗi không xác định.'}</div>`;
        }
      } catch (error) {
        resultDiv.innerHTML = `<div class="alert alert-danger border-0"><i class="bi bi-exclamation-triangle-fill me-2"></i> Có lỗi xảy ra khi gọi API MP3.</div>`;
      }
    }

    async function downloadMp4(videoId, resultDiv) {
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'f6580fc793msh8abe2cea14e27cfp1ae092jsna25f56184781', // Thay thế bằng key của bạn
                'X-RapidAPI-Host': 'youtube-media-downloader.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(`https://youtube-video-downloader-pro.p.rapidapi.com/dl?id=${videoId}`, options);
            const data = await response.json();
            if (data.status === 'success' && data.video) {
                let linksHtml = '';
                // Lọc và chỉ hiển thị các định dạng video có cả hình và tiếng
                const videoLinks = data.video.filter(v => v.type === 'video/mp4' && v.hasAudio);
                
                if(videoLinks.length > 0) {
                    videoLinks.forEach(video => {
                        linksHtml += `<a href="${video.url}" target="_blank" class="btn btn-sm btn-outline-light mb-2 w-100">${video.qualityLabel} - MP4</a>`;
                    });
                     resultDiv.innerHTML = `
                        <h5 class="text-white mb-2"><i class="bi bi-check-circle-fill me-2" style="color: var(--star-yellow);"></i> Video Sẵn Sàng!</h5>
                        <p class="mb-3 text-white-50 small">${data.title}</p>
                        <div class="d-grid gap-2 w-75">${linksHtml}</div>
                    `;
                } else {
                     resultDiv.innerHTML = `<div class="alert alert-warning border-0"><i class="bi bi-exclamation-triangle-fill me-2"></i> Không tìm thấy định dạng video MP4 phù hợp.</div>`;
                }
            } else {
                resultDiv.innerHTML = `<div class="alert alert-danger border-0"><i class="bi bi-x-circle-fill me-2"></i> Thất bại. ${data.message || 'Không thể lấy thông tin video.'}</div>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<div class="alert alert-danger border-0"><i class="bi bi-exclamation-triangle-fill me-2"></i> Có lỗi xảy ra khi gọi API Video.</div>`;
        }
    }