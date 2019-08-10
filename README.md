# url-shortener

## 프로젝트 소개

- 목표
    * URL 을 입력받아 짧게 줄여주고, Shortening 된 URL 을 입력하면 원래 URL 로 리다이렉트하는 URL Shortening Service 구현
- 요구사항
    * webapp 으로 개발하고 URL 입력폼 제공 및 결과 출력
    * URL Shortening Key 는 8 Character 이내로 생성되어야 합니다.
    * 동일한 URL 에 대한 요청은 동일한 Shortening Key 로 응답해야 합니다.
    * Shortening 된 URL 을 요청받으면 원래 URL 로 리다이렉트 합니다.
    * Shortening Key 생성 알고리즘은 직접 구현해야 합니다. (라이브러리 사용 불가)
    * Unit Test 코드 작성
    * Database 사용은 필수 아님 (선택)
    
------
## 문제해결 전략

### 프로젝트 수행 방향 정의
1. URL Shortening에 대한 원리 및 기술 조사
2. 프로젝트 목표와 요구사항을 충족시킬 수 있는 개발환경 선정
3. 요구사항에 부합하는 프로그램 설계
4. 프로그램 구현 및 단위 테스트 구현
5. 테스트

### 프로젝트 진행
1. URL Shortening에 대한 원리 및 기술 조사
    * URL Shortening 방법 조사
        - 원본 URL에 대해 고유한 Integer ID를 만들고 이를 base62로 인코딩하여 짧은 URL을 만듦.
        - base62을 사용하는 이유 : a-z, A-Z, 0-9의 문자 수가 총 62개이므로 base62 사용, 반드시 base62로 해야하는 것은 아니므로 a-z, 0-9만 사용하여 base36으로 해도 무방함.
    * 짧은 URL을 통해 실제 URL로 이동 방법 조사
        - 짧은 URL의 Request에 대해 Response로 301 또는 302가 전달되고 Location 헤더에 실제 URL 정보를 보냄.
        - 301과 302 Redirect의 차이  
            301 : 영구이동, 완전히 새로운 URL로 변경됨을 의미함.  
            302 : 임시이동, 일시적으로 URL이 변경됨을 의미함.  
            **301 / 302는 프로젝트 구현에 영향이 없다고 판단하여 301로 리다이렉트 하기로 함.**
            

2. 프로젝트 목표와 요구사항을 충족시킬 수 있는 개발환경 선정
- 다음 조건을 고려하여 nodejs와 express를 사용하기로 함.
    * webapp을 개발할 수 있어야함.
    * 가벼워야 함(별도의 라이브러리나 WAS같은 프로그램 설치 최소화).
    * 경험해 본 적이 있어야 함.

3. 요구사항에 부합하는 프로그램 설계
* **데이터베이스 사용 여부**  
    데이터베이스 사용은 필수가 아니므로 테이블 설계 및 DB connection 등 데이터베이스 관련 작업을 줄이기 위해 사용하지 않기로 함.  
    단, url 정보는 json 형태로 메모리에만 있으므로 node 서버를 재구동하면 url을 다시 등록해야함.  

* **URL Shortening**  
    데이터베이스를 사용하지 않고 URL마다 고유한 Integer ID를 구해야하는데 Hash function을 이용하기로 함.   
    division mehtod 방식으로 구현하였으며, (('url 문자의 urf-16 코드값' x (3^(문자열의 자리수) % m)) + '앞 문자의 key값') % m 으로 Hash 값을 구하였다.  
    이때, m은 단축URL이 8자리 이내로 생성되어야 하므로 62^8 보다 작은 소수 중  가장 큰 소수인 218340105584893을 사용하였다.  
    이는 url-shortener.js에 function hash(url)에 구현되어 있다.  
    
    hash를 통해 구한 ID를 base62로 인코딩은 재귀함수 encId(id)로 구현하였으며, id를 62로 나눈 몫이 0이 될때까지 반복 호출하여 그 나머지 값이 가르키는 문자를 리턴하도록 하였다.  
    
* **URL Shortening Key 는 8 Character 이내로 생성되어야 함.**  
    원본 URL을 이용해 ID를 만들때 62^8보다 작은 소수인 218340105584893으로 나눈 나머지 값을 이용하므로 URL Shortening Key는 항상 8자리 이내가 됨.  
    
* **동일한 URL 에 대한 요청은 동일한 Shortening Key 로 응답해야 함.**  
    원본 URL에 대한 hash값은 항상 동일하므로 동일한 Shortening Key로 응답함.  
    또한, 한번 계산한 Shortening Key는 다음 요청 시 base62인코딩 과정을 생략할 수 있도록 url json데이터로 저장함.  
    그 구조는 Integer ID를 key로 하고 value는 원본 url과 URL Shortening Key로 한다.  
    ```
        {
            URL_ID : { oURL:원본URL, sURL:URL Shortening Key },
            URL_ID : { oURL:원본URL, sURL:URL Shortening Key },
            ...
            URL_ID : { oURL:원본URL, sURL:URL Shortening Key }
        }
    ```
    url 단축 요청이 들어오면 url-shortener.js의 function getShortUrl에서 url의 id를 구하고 json data에서 id를 key로 하는 데이터가 있는지 찾아보고 없으면 base62로 인코딩하여 URL Shortening Key를 만들고 그 정보를 json data에 담고 URL Shortening key를 리턴한다.  
    
* **Shortening 된 URL 을 요청받으면 원래 URL로 리다이렉트**
    base62로 인코딩 된 URL Shortening Key는 디코딩 하면 URL의 ID가 된다 그것을 key로 하여 url json 데이터에서도 찾을 수 있게 하였다.  
    이는 url-shortener.js의 function getOriginUrl에 구현되어 있다.  

* **프로그램 구현**  
    앞서 설계한 것과 같이 url shortening의 핵심기능은 ./modules/url-shortener.js에 구현하였으며, request에 대한 라우팅은 ./router/main.js에서 처리한다.  
    서버에 접속하였을때 표시되는 페이지는 ./views/index.ejs 이다.  
    
    dependencies는 다음과 같다.  
    ```
        {
          "dependencies": {
            "ejs": "~2.4.1",
            "express": "^4.17.1"
          },
          "devDependencies": {
            "mocha": "^6.2.0"
          }
        }
    ```
    
* **Unit Test 코드 작성**  
    Unit test는 nodejs의 테스트 프레임워크 중 하나인 mocha를 사용하였다.   
    핵심 기능 모듈인 url-shortener.js의 getShortUrl, getOriginUrl함수에 대해 테스트하며  ./test/url-shortener.spec.js에 구현되어 있다.  
    테스트 내용은 하단의 단위 테스트 방법' 참조
    
------
## 실행방법 및 테스트

### 실행방법
1. nodejs 설치
  - version : 10.16.2 이상

2. 서버 실행
  - 소스를 받아 압축을 풀고 server.js 파일이 있는 폴더에서 다음 명령어 실행.
  
      **node server.js**
   
  - 다음과 같은 문구가 표시되면 제대로 실행된 것이다.
  
      **Server has started on port 3000**

3. 브라우저를 실행하여 다음 url로 이동한다.

      http://localhost:3000/

4. 'URL' 입력 부분에 URL을 입력하고 [URL 변환] 버튼을 클릭하면 'short URL'에 단축한 URL이 표시된다.

5. 브라우저의 새탭을 열어 단축한 URL로 이동하면, 원본url로 리다이렉트 된다.

### 단위 테스트 방법
1. 노드가 설치된 상태에서 소스가 있는 폴더로 이동해 다음 명령어를 실행한다.

      **npm test ./test/url-shortener.spec.js**

2. 모듈 url-shortener에 대해 9개의 테스트가 실행된다.
  - getShortUrl : 원본 URL을 입력받아 짧은 URL을 리턴하는 함수로 총 5개의 테스트가 실행된다.
    - test-00 ~ 02 : URL을 변환하여 예상한 결과대로 리턴되는지 테스트 한다.
    - test-03 : test-02에서 테스트 한 URL을 다시 요청하였을 때 test-02 때 나왔던 값과 같은 값이 리턴되는지 테스트 한다.
    - test-04 : 표현되는 문자 종류와 개수는 같고 순서만 다른 문자열들(ex. abcd, dcba)을 변환 했을때 다른 결과가 리턴되는 테스트 한다.

  - getOriginUrl : 짧은 URL을 받아 원본 URL을 리턴하는 함수로 총 4개의 테스트가 실행된다.
    - test-00 ~ 02 : 짧은 URL을 입력받아 예상한 원본 URL이 리턴되는지 테스트 한다.
    - test-03 : 등록되지 않은 url로 요청이 들어올 경우 'ERROR_NOT_REGISTERED'라는 에러코드가 출력되는지 테스트 한다.
------
끝.
