/*
 *
 * PaperList
 *
 */
import { useState, useEffect } from 'react';

export default function PaperList() {
  //====================================== State ======================================
  const [interviewer, setInterviewer] = useState(localStorage.getItem('interviewer'));
  //====================================== Hook ======================================
  useEffect(() => {
    if (localStorage.getItem('interviewer')) setInterviewer(localStorage.getItem('interviewer'));
  }, []);
  //====================================== Render ======================================
  return (
    <div className="bg-base-100 shadow-md p-5">
      <h1 className="text-lg font-semibold text-center mb-5">CÂU HỎI PHỎNG VẤN</h1>
      <div className="text-left">
        <div className="form-control w-full">
          <label className="label p-0 m-0 text-sm mb-2">Người phỏng vấn</label>
          <input
            placeholder="Người phỏng vấn"
            className="input input-bordered w-1/4"
            value={interviewer ?? localStorage.getItem('interviewer') ?? ''}
            onChange={e => {
              localStorage.setItem('interviewer', e.target.value);
              setInterviewer(e.target.value);
            }}
          />
        </div>

        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 my-3">
          <input type="checkbox" defaultChecked />
          <h4 className="collapse-title text-primary font-bold text-2xl">A. Động cơ xét tuyển thành viên và quan tâm đến công việc</h4>
          <div className="collapse-content">
            <h5 className="text-lg my-1">1. Vì sao anh chị nộp đơn tham gia vào kì thi tuyển thành viên của đội?</h5>
            <h5 className="text-lg my-1">2. Anh chị có nhận xét gì về đội?</h5>
            <h5 className="text-lg my-1">3. Điều gì thích thú trong đội mà anh chị đang muốn tuyển ?</h5>
            <h5 className="text-lg my-1">4. Điều gì khiến anh chị cảm thấy được kích thích nhất trong tham gia vào đội?</h5>
            <h5 className="text-lg my-1">5. Theo anh chị khi tham gia vào đội có yêu cầu đòi hỏi gì?</h5>
            <h5 className="text-lg my-1">6. Anh chị dự định sẽ tổ chức việc học tập, lao động khi tham gia đội như thế nào?</h5>
            <h5 className="text-lg my-1">7. Anh chị sẵn sàng làm những việc tình nguyện, không lương vì đội không? Vì sao?</h5>
          </div>
        </div>
        {/* ================= */}
        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 my-3">
          <input type="checkbox" />
          <h4 className="collapse-title text-primary font-bold text-2xl">B. Đào tạo và giáo dục</h4>
          <div className="collapse-content">
            <h5 className="text-lg my-1">1. Anh chị thích hay không thích môn nào nhất? Tại sao?</h5>
            <h5 className="text-lg my-1">2. Đánh giá chung của anh chị về hoạt động đào tạo chuyên ngành, các nhóm, tự học, chia sẻ?</h5>
            <h5 className="text-lg my-1">3. Anh chị trang trải học phí của mình bằng cách nào?</h5>
            <h5 className="text-lg my-1">4. Anh chị ôn thi đại học bằng cách nào?</h5>
          </div>
        </div>
        {/* ================= */}
        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 my-3">
          <input type="checkbox" />
          <h4 className="collapse-title text-primary font-bold text-2xl">C. Kiến thức kinh nghiệm trong công việc</h4>
          <div className="collapse-content">
            <h5 className="text-lg my-1">
              1. Hãy kể cho chúng tôi nghe về những nơi, tổ chức đội các anh chị đã làm việc, tên công việc, thời gian, nội dung, chức vụ
            </h5>
            <h5 className="text-lg my-1">2. Anh chị đạt được những giải thưởng nào liên quan đến công việc tại tổ chức, CLB đó?</h5>
            <h5 className="text-lg my-1">3. Anh chị có thể làm những công việc nào ở đội chúng tôi?</h5>
            <h5 className="text-lg my-1">4. Những kinh nghiệm cũ giúp gì cho công việc mới tại đội mới?</h5>
            <h5 className="text-lg my-1">5. Hãy kể về những thành công lớn nhất trong công việc của anh chị?</h5>
            <h5 className="text-lg my-1">6. Anh chị có thường xuyên hoàn thành công việc với chất lượng và thời gian đúng hạn không?</h5>
            <h5 className="text-lg my-1">7. Anh chị dự đính sẽ làm những việc gì trong những ngày đầu tiên làm thành viên đội?</h5>
            <h5 className="text-lg my-1">
              8. *Ngoài ra* hỏi tiêu chuẩn cho công việc là gì? Tiêu chuẩn nào là quan trọng nhất. Làm thế nào để thực hiện một công việc cụ thể? Xử
              lý một tình huống cụ thể?
            </h5>
          </div>
        </div>
        {/* ================= */}
        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 my-3">
          <input type="checkbox" />
          <h4 className="collapse-title text-primary font-bold text-2xl">D. Khả năng hoà đồng và giao tiếp</h4>
          <div className="collapse-content">
            <h5 className="text-lg my-1">1. Hãy kể về lớp trưởng, bí thư và những người bạn của anh chị?</h5>
            <h5 className="text-lg my-1">2. Anh chị thấy rằng làm việc một mình hay theo nhóm sẽ thích hợp, hiệu quả hơn?</h5>
            <h5 className="text-lg my-1">3. Anh chị giải quyết xunng đột như thế nào?</h5>
            <h5 className="text-lg my-1">4. Quan hệ của anh chị và những người hàng xóm, bạn cùng phòng như thế nào?</h5>
            <h5 className="text-lg my-1">5. Anh chị có thể cảm thấy khó khăn khi tiếp xúc với người mới quen không?</h5>
            <h5 className="text-lg my-1">6. 1 tình huống cụ thể</h5>
          </div>
        </div>
        {/* ================= */}
        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 my-3">
          <input type="checkbox" />
          <h4 className="collapse-title text-primary font-bold text-2xl">E. Tự nhận xét bản thân, ý thức trách nhiệm và cầu tiến</h4>
          <div className="collapse-content">
            <h5 className="text-lg my-1">1. Anh chị vui lòng nhận xét về bản thân của anh chị?</h5>
            <h5 className="text-lg my-1">2. Những ưu thế của anh chị so với ứng viên khác? Đâu là điểm mạnh và điểm yếu của anh chị?</h5>
            <h5 className="text-lg my-1">3. Những điều anh chị muốn kể cho chúng tôi biết về anh chị?</h5>
            <h5 className="text-lg my-1">4. Bạn bè đánh giá anh chị như thế nào?</h5>
            <h5 className="text-lg my-1">5. Dự định của anh chị trong tương lai?</h5>
            <h5 className="text-lg my-1">6. Ước muốn lớn nhât trong nghề nghiệp học tập của anh chị là gì?</h5>
            <h5 className="text-lg my-1">7. Điều gì ảnh hướng lớn đến sự tiến bộ nghề nghiệp, học tập của anh chị?</h5>
            <h5 className="text-lg my-1">8. Theo anh chị nhà quản trị, chủ nhiệm, leader cần những phẩm chất gì?</h5>
            <h5 className="text-lg my-1">9. Nếu được trúng tuyển vào đội anh chị có mong đợi hoặc đề nghị gì với ban chủ nhiệm đội?</h5>
          </div>
        </div>
        {/* ================= */}
        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200 my-3">
          <input type="checkbox" />
          <h4 className="collapse-title text-primary font-bold text-2xl">F. Quan điểm sở thích chung</h4>
          <div className="collapse-content">
            <h5 className="text-lg my-1">1. Điều gì làm anh chị khó chịu nhất trong cuộc sống hiện nay?</h5>
            <h5 className="text-lg my-1">2. Những thói quen và sở thích của anh chị là gì?</h5>
            <h5 className="text-lg my-1">3. Nếu anh chị tuyển thành viên khoá sau, anh chị thấy ứng viên phải có tiêu chuẩn gì?</h5>
            <h5 className="text-lg my-1">4. Anh chị kích thích, động viên thành viên dưới quyền, thành viên cùng tuổi như thế nào?</h5>
            <h5 className="text-lg my-1">5. Hãy kể về một thất bại và cách anh chị vượt qua thất bại đó.</h5>
            <h5 className="text-lg my-1">6. Điều gì thường làm anh chị phải lưỡng lự nhất?</h5>
            <h5 className="text-lg my-1">7. Bài học kinh nghiệm quý báu nhất mà anh chị đã học được trong thời gian qua?</h5>
            <h5 className="text-lg my-1">8. Anh chị có nhận xét gì về tình hình kinh tế, chính trị, xã hội hiện này?</h5>
          </div>
        </div>
      </div>
    </div>
  );
}
