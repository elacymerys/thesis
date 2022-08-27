package pl.edu.agh.quizzesthesis.business;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.edu.agh.quizzesthesis.api.dto.CategoryResponse;
import pl.edu.agh.quizzesthesis.api.dto.QuestionResponse;
import pl.edu.agh.quizzesthesis.business.mapper.CategoryMapper;
import pl.edu.agh.quizzesthesis.data.CategoryRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class QuestionService {

    private final TermService termService;
    private final DefinitionService definitionService;
    private final DefinitionProcessingService definitionProcessingService;
    private final WrongAnswerService wrong_answers_service;

    public QuestionResponse generateQuestion(int categoryId) {
        var term = termService.getRandom(categoryId);
        var definitionArticle = definitionService.getDefinition(term.getName());
        String processedDefinition = definitionProcessingService
                .startProcessing(definitionArticle.definition(), term.getName(), definitionArticle.articleTitle())
                .standardizeDefinitionLength()
                .removeAnswerFromDefinition()
                .getDefinition();


//        processed_definition = definition_processing_service. \
//        standardize_definition_length(). \
//        remove_answer_from_definition(). \
//        wrap_text(). \
//        get_definition()
//
//        wrong_answers_service = DatamuseWrongAnswerService(self.term_service)
//        wrong_answers = wrong_answers_service.get_wrong_answers(term)
//
//        answers = [term.name] + wrong_answers
//        random.shuffle(answers)
//
//        question = Question(question=processed_definition, correct=term, answers=answers)
//        return question
        return null;
    }
}
