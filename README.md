# express + nodemon + tsc composite
typescript 환경에서 src 폴더와 public 폴더의 코드를 따로 컴파일 하면서 개발환경에서 해당 변경 사항을 바로 반영하고 싶다는 생각을 많이 했다.

이때 두 폴더는 다음과 같은 특징을 가진다.

1. src 폴더는 배포할 때만 코드가 생성되면 ok
2. public 폴더의 자바스크립트 파일은 view 파일들에서 참조하므로, 개발 환경에서도 생성되면 좋겠다.   

위 요구사항은 다음 조건들을 요구한다.
