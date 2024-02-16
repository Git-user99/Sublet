import { useState } from "react";
import { DateFormat, priceToString } from "./StaticComponents.js";
import * as s from './styles/SummaryBlock.styles.js'
import * as w from './styles/Wrapper.style.js'

import './styles/Popup.styles.css'
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { DeletePost, DeleteRequest, FetchDeleteReservation, FetchGetRequestByRequestId } from "./FetchList.js";
import { ReservationByPostKeyInfo } from "./Reservation.js";
import { PostRequest, RequestByPostKeyInfo } from "./Request.js";

function RequsetSummaryBlock({ city, Post, request_key, gu, dong, accomodation_type, start_date, end_date, pay, complete, contract }) {
  const address = city + ' ' + gu + ' ' + dong;
  const info_list = {
    '숙소 유형': accomodation_type,
    '요금': pay,
    '체크인': start_date,
    '체크아웃': end_date,
  }

  const [inputs, setInputs] = useState({
    detailPopUpState: false,
    respondPopUpState: false,
    deletePopUpState: false,
    checkState: false

  })

  const {
    detailPopUpState,
    respondPopUpState,
    deletePopUpState,
    checkState
  } = inputs;

  const onChange = e => {
    setInputs({
      ...inputs,
      [e.currentTarget.name]: !inputs[e.currentTarget.name]
    });
  };

  const deleteHandle = () => {
    DeleteRequest(request_key)
  }

  return (
    <div className="ml-4">
      <w.SecondHead>• {address}</w.SecondHead>
      {/*  */}
      <div className="ml-2">
        {complete ?
          (
            <p className="ml-3 text-lg text-[#F62424] font-medium">
              요청서 완료
            </p>) :
          (
            <p className="ml-3 text-base text-blue-700 font-medium">
              요청서 진행중
            </p>
          )}
      </div>
      {/* 공개 변경 버튼 추가 */}
      <s.reservation_detail_button name="detailPopUpState" onClick={onChange}>
        상세정보
      </s.reservation_detail_button>
      <s.reservation_detail_button name="respondPopUpState" onClick={onChange}>
        응답 리스트
      </s.reservation_detail_button>
      <s.delete_button_able name="deletePopUpState" onClick={onChange}>
        삭제하기
      </s.delete_button_able>
      <div name="requestDetailDialog">
        <Dialog open={detailPopUpState} className="border border-gray-300 shadow-xl rounded-lg">
          <DialogContent className='text-left'>
            <s.close_button type="button" className='float-right' name="detailPopUpState" onClick={onChange} >
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </s.close_button>

            <w.SecondHead>{address} </w.SecondHead>

            <w.Horizon />
            {
              contract ?
                (<p>계약된 매물만 확인</p>) :
                (<p>계약 안된 매물도 확인</p>)
            }
            {Object.keys(info_list).map((k => (
              <Information title={k}
                info={info_list[k]} />
            )))}
          </DialogContent>

        </Dialog>

      </div>


      <div name="respondDialog">
        <Dialog open={respondPopUpState} className="border border-gray-300 shadow-xl rounded-lg">
          <DialogContent className='text-left'>
            <form>
              <s.close_button type="button" name="respondPopUpState" onClick={onChange} className='float-right'>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </s.close_button>
            </form>
            {Post.length > 0 ?
              <RequestByPostKeyInfo
                Post={Post} /> :
              <p>아직 매칭이 되지 않았습니다.</p>
            }
          </DialogContent>
        </Dialog>

      </div>

      <div name="deletePopUpState">
        <Dialog open={deletePopUpState} className="border border-gray-300 shadow-xl rounded-lg">
          <DialogContent className='font-black text-center'>
            <form>
              <s.close_button type="button" onClick={onChange} name="deletePopUpState" className='float-right'>
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </s.close_button>
            </form>
            <p className="text-lg font-extrabold mt-3">요청서를 삭제하시겠습니까?</p>
            <div>
              <p className="mt-3  font-medium">
                <s.input_checkbox type="checkbox" checked={checkState} name="checkState" onChange={onChange} />
                삭제 확인
              </p>
            </div>
          </DialogContent>
          <DialogActions>

            <div className='mt-5'>
              {checkState ? (
                <form>
                  <s.delete_button_able onClick={deleteHandle} >
                    삭제하기
                  </s.delete_button_able>
                </form>) : (<s.delete_button_disabled disabled>
                  삭제하기
                </s.delete_button_disabled>)}
            </div>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
}

function ReservationSummaryBlock({ title, start_day, end_day, pay, host, room_image, key_num }) {
  const [popupState, setpopupState] = useState(false)
  const startStr = DateFormat(start_day)
  const endStr = DateFormat(end_day)

  const clickHandler = () => {
    setpopupState(!popupState)
    setCheckState(false)
  }

  const [checkState, setCheckState] = useState(false)

  const checkHandled = () => {
    setCheckState(!checkState)
  }
  const deleteReservationHandle = () => {
    FetchDeleteReservation(key_num)
  }
  const image_link = `${process.env.REACT_APP_BACKEND_URL}/public/${room_image}.jpg`

  pay = priceToString(pay)

  return (
    <div className="flex grid grid-cols-5 mt-4 ml-4">
      <div>
        <img
          className="objec t-scale-down rounded-lg"
          src={image_link}></img>
      </div>
      <div className="mb-2 ml-3 col-span-4">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <p className="ml-3 text-lg font-medium">호스트: {host}</p>
        <p className="ml-3 text-lg font-medium">기간: {startStr} ~ {endStr}</p>
        <p className="ml-3 text-lg font-medium">비용: {pay}</p>
        <div>
          <s.reservation_cancel_button
            onClick={clickHandler}>
            취소하기
          </s.reservation_cancel_button>

          <s.reservation_detail_button>
            상세정보
          </s.reservation_detail_button>
          <>
            <Dialog open={popupState} className="border border-gray-300 shadow-xl rounded-lg">
              <DialogContent className='font-black text-center'>
                <p className="text-lg font-extrabold mt-3">예약중인 숙소를 취소하시겠습니까?</p>
                <div>
                  <p className="mt-3  font-medium">
                    <s.input_checkbox type="checkbox" checked={checkState} onChange={checkHandled} />
                    환불규정 및 취급 수수료를 확인했습니다.
                  </p>
                </div>
              </DialogContent>
              <div className='mt-5'>
                <s.back_button onClick={clickHandler} className="">
                  나가기
                </s.back_button>
                {checkState ? (
                  <form>
                    <s.delete_button_able onClick={deleteReservationHandle} >
                      취소하기
                    </s.delete_button_able>
                  </form>
                ) : (<s.delete_button_disabled disabled>
                  취소하기
                </s.delete_button_disabled>)}
              </div>
            </Dialog>
          </>
        </div>
      </div>
    </div >

  );
}

function Information({ title, info }) {
  return (
    <div>
      <p className="ml-1 text-m font-bold">• {title}</p>
      <p className="ml-4 text-sm font-medium">{info}</p>
    </div>
  )
}

function PostSummaryBlock({ title, post_key, id_list, accomodation_type, post_date, pay, contract, private_post, address, room_image }) {

  const image_link = `${process.env.REACT_APP_BACKEND_URL}/public/${room_image}.jpg`
  const [inputs, setInputs] = useState({
    detailDialogShow: false,
    reservationDialogShow: false,
    deletelDialogShow: false,
    checkState: false,
    requestDialogShow: false
  })

  const {
    detailDialogShow,
    reservationDialogShow,
    deletelDialogShow,
    checkState,
    requestDialogShow
  } = inputs;
  const onChange = e => {
    setInputs({
      ...inputs,
      [e.currentTarget.name]: !inputs[e.currentTarget.name]
    });
  };

  const deleteHandle = () => {
    DeletePost(post_key)
  }
  const info_list = {
    '숙소 유형': accomodation_type,
    '게시일': post_date,
    '요금': pay,
    '주소': address,
  }
  const request_list = FetchGetRequestByRequestId(id_list)
  return (
    <div className="flex grid grid-cols-5 mt-4 ml-4">
      <div>
        <img
          className="objec t-scale-down rounded-lg"
          src={image_link}></img>
      </div>
      <div className="mb-2 ml-3 col-span-4">
        <div className="inline-block">
          <h2 className="text-2xl font-extrabold float-start mr-4">{title} </h2>
          {contract ?
            (
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                <path d="M14.5 0.541992C6.91 0.541992 0.75 6.70199 0.75 14.292C0.75 21.882 6.91 28.042 14.5 28.042C22.09 28.042 28.25 21.882 28.25 14.292C28.25 6.70199 22.09 0.541992 14.5 0.541992ZM10.7738 20.1907L5.8375 15.2545C5.30125 14.7182 5.30125 13.852 5.8375 13.3157C6.37375 12.7795 7.24 12.7795 7.77625 13.3157L11.75 17.2757L21.21 7.81574C21.7462 7.27949 22.6125 7.27949 23.1488 7.81574C23.685 8.35199 23.685 9.21824 23.1488 9.75449L12.7125 20.1907C12.19 20.727 11.31 20.727 10.7738 20.1907Z" fill="#6724F7" />
              </svg>) :
            (
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                <path d="M14.5 0.929199C6.91 0.929199 0.75 7.0892 0.75 14.6792C0.75 22.2692 6.91 28.4292 14.5 28.4292C22.09 28.4292 28.25 22.2692 28.25 14.6792C28.25 7.0892 22.09 0.929199 14.5 0.929199ZM10.7738 20.5779L5.8375 15.6417C5.30125 15.1054 5.30125 14.2392 5.8375 13.7029C6.37375 13.1667 7.24 13.1667 7.77625 13.7029L11.75 17.6629L21.21 8.20295C21.7462 7.6667 22.6125 7.6667 23.1488 8.20295C23.685 8.7392 23.685 9.60545 23.1488 10.1417L12.7125 20.5779C12.19 21.1142 11.31 21.1142 10.7738 20.5779Z" fill="#616161" />
              </svg>
            )}
        </div>

        <p className="ml-3 text-lg font-medium">주소: {address}</p>
        <p className="ml-3 text-lg font-medium">숙박료: {pay}</p>
        <s.post_detail_button name="detailDialogShow" onClick={onChange}>
          상세정보
        </s.post_detail_button>

        <s.post_detail_button className="ml-4" name="requestDialogShow" onClick={onChange}>
          받은 요청서
        </s.post_detail_button>

        <s.post_detail_button className="ml-4" name="reservationDialogShow" onClick={onChange}>
          예약현황
        </s.post_detail_button>

        <s.delete_button_able className="ml-4" name="deletelDialogShow" onClick={onChange}>
          삭제하기
        </s.delete_button_able>
        <div name="detailDialog">
          <Dialog open={detailDialogShow} className="border border-gray-300 shadow-xl rounded-lg">
            <DialogContent className='text-left'>
              <form>
                <s.close_button type="button" name="detailDialogShow" onClick={onChange} className='float-right'>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </s.close_button>
              </form>
              <div className="inline-block">
                <h2 className="text-2xl font-extrabold float-start mr-4">{title} </h2>
                {contract ?
                  (
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                      <path d="M14.5 0.541992C6.91 0.541992 0.75 6.70199 0.75 14.292C0.75 21.882 6.91 28.042 14.5 28.042C22.09 28.042 28.25 21.882 28.25 14.292C28.25 6.70199 22.09 0.541992 14.5 0.541992ZM10.7738 20.1907L5.8375 15.2545C5.30125 14.7182 5.30125 13.852 5.8375 13.3157C6.37375 12.7795 7.24 12.7795 7.77625 13.3157L11.75 17.2757L21.21 7.81574C21.7462 7.27949 22.6125 7.27949 23.1488 7.81574C23.685 8.35199 23.685 9.21824 23.1488 9.75449L12.7125 20.1907C12.19 20.727 11.31 20.727 10.7738 20.1907Z" fill="#6724F7" />
                    </svg>) :
                  (
                    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                      <path d="M14.5 0.929199C6.91 0.929199 0.75 7.0892 0.75 14.6792C0.75 22.2692 6.91 28.4292 14.5 28.4292C22.09 28.4292 28.25 22.2692 28.25 14.6792C28.25 7.0892 22.09 0.929199 14.5 0.929199ZM10.7738 20.5779L5.8375 15.6417C5.30125 15.1054 5.30125 14.2392 5.8375 13.7029C6.37375 13.1667 7.24 13.1667 7.77625 13.7029L11.75 17.6629L21.21 8.20295C21.7462 7.6667 22.6125 7.6667 23.1488 8.20295C23.685 8.7392 23.685 9.60545 23.1488 10.1417L12.7125 20.5779C12.19 21.1142 11.31 21.1142 10.7738 20.5779Z" fill="#616161" />
                    </svg>
                  )}
              </div>
              {private_post ? <p className="font-sm text-black font-bold">공개</p>
                : <p className="font-sm text-gray-600 font-bold">비공개</p>}
              {/* 공개 변경 버튼 추가 */}
              <hr className="h-px bg-gray-200 border-0" />
              {Object.keys(info_list).map((k => (
                <Information title={k}
                  info={info_list[k]} />
              )))}
            </DialogContent>

          </Dialog>

        </div>

        <div name="reservationDialog">
          <Dialog open={reservationDialogShow} className="border border-gray-300 shadow-xl rounded-lg">
            <DialogContent className='text-left'>
              <form>
                <s.close_button type="button" name="reservationDialogShow" onClick={onChange} className='float-right'>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </s.close_button>
              </form>
              <ReservationByPostKeyInfo
                post_key={post_key} />
            </DialogContent>

          </Dialog>

        </div>

        <div name="deleteDialog">
          <Dialog open={deletelDialogShow} className="border border-gray-300 shadow-xl rounded-lg">
            <DialogContent className='font-black text-center'>
              <form>
                <s.close_button type="button" onClick={onChange} name="deletelDialogShow" className='float-right'>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </s.close_button>
              </form>
              <p className="text-lg font-extrabold mt-3">게시글을 삭제하시겠습니까?</p>
              <div>
                <p className="mt-3  font-medium">
                  <s.input_checkbox type="checkbox" checked={checkState} name="checkState" onChange={onChange} />
                  삭제 확인
                </p>
              </div>
            </DialogContent>
            <DialogActions>

              <div className='mt-5'>
                {checkState ? (
                  <form>
                    <s.delete_button_able onClick={deleteHandle} >
                      삭제하기
                    </s.delete_button_able>
                  </form>) : (<s.delete_button_disabled disabled>
                    삭제하기
                  </s.delete_button_disabled>)}
              </div>
            </DialogActions>
          </Dialog>

        </div>

        <div name="requestDialog">
          <Dialog open={requestDialogShow} className="border border-gray-300 shadow-xl rounded-lg">
            <DialogContent className='text-left'>
              <form>
                <s.close_button type="button" name="requestDialogShow" onClick={onChange} className='float-right'>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </s.close_button>
              </form>
              {request_list !== false &&
                <PostRequest
                  request_list={request_list} />}
            </DialogContent>

          </Dialog>

        </div>
      </div>
    </div>
  )
}


export { ReservationSummaryBlock, PostSummaryBlock, RequsetSummaryBlock }