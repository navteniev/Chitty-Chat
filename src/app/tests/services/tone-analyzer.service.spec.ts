import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToneAnalyzerService } from 'src/app/services/tone-analyzer.service';

describe('ToneAnalyzerService', () => {

  const POST_URI = 'postURI';
  const POST_ENDPOINT = '/api/tone';
  const MESSAGE = 'sample message';

  let serviceUnderTest: ToneAnalyzerService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        ToneAnalyzerService,
        { provide: HttpClient, useValue: httpClientSpy}
      ]
    });

    environment.uri = POST_URI;
    serviceUnderTest = TestBed.get(ToneAnalyzerService);
  });

  it('calling toneAnalyze() SHOULD return observable', () => {

    serviceUnderTest.toneAnalyze(MESSAGE);

    expect(httpClientSpy.post).toHaveBeenCalled();
    const uriArgument = httpClientSpy.post.calls.argsFor(0)[0];
    expect(uriArgument).toEqual(POST_URI.concat(POST_ENDPOINT));
  });
});
