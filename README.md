# 복식 경기 스케쥴러



## 사용법

1. https://cloneot.github.io/doubles-scheduler/에 들어간다. 
3. `sample_in.csv` 형식으로 이름, 도착 시간, 실력 등의 정보가 담긴 csv 파일을 만들어 업로드한다. 
4. 기다리면 대진표가 생성된다. 미리보기를 보고, 표 형식으로 다운받고 싶으면 download 링크를 누른다. 
5. 마음에 들지 않으면 새로고침을 한 후 `2-3`를 반복한다. 



## 커스텀

대진표를 생성하기 위해 [DLAS 알고리즘](https://gist.github.com/cgiosy/ed16f4988eeb7e989a97644fe61e1561)을 사용한다. 

`State class`가 대진표를 나타내고, `f(state: State): number`를 최소화하는 것이 목적이다. 

`State`는 `class.js`에, `f`는 `main.js`에 있다. 



휴리스틱 동작에 영향을 미칠 수 있는 요소는 다음과 같다. 전부 `main.js`에 대한 내용이다:

- `main` 함수의 dlas 로직에서 `재시작 횟수`와 `maxIdleIters`를 수정한다. 위 링크를 참고하면 좋다. 
- `impoConst`, `sexDiffConst` 상수를 변경한다. `impoConst`를 줄이면 불가능한 대진표가 만들어질 가능성이 높고, `sexDiffConst`를 줄이면 혼합복식, 남자복식, 여자복식 여부를 덜 신경쓰게 만든다. 
- `calcPerformance(rating1, rating2)` 함수를 변경한다. 디폴트는 `rating1+rating2`로 팀 퍼포먼스를 구하지만, `rating`이 낮은 쪽 가중평균을 사용하면 팀원 간의 실력 차가 큰 팀의 퍼포먼스를 더 정확히 구할 수 있을 수도 있다. 
- `f`에 로직을 추가하거나 제거한다. 

