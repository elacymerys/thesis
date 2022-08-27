package pl.edu.agh.quizzesthesis.api;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.edu.agh.quizzesthesis.api.dto.TermDifficultyUpdateRequest;
import pl.edu.agh.quizzesthesis.business.TermService;

import static pl.edu.agh.quizzesthesis.App.API_URL_PREFIX;

@RestController
@RequestMapping(API_URL_PREFIX + "/terms")
@AllArgsConstructor
public class TermController {

    private final TermService termService;

    @PatchMapping("/{termId}")
    public void updateTermDifficulty(@PathVariable int termId, @RequestBody TermDifficultyUpdateRequest request) {
        termService.updateTermDifficulty(termId, request);
    }
}
